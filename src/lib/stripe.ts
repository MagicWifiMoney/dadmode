import Stripe from 'stripe';
import { PLANS, type PlanId } from './plans';

// Server-only Stripe helpers. Like the Resend integration, everything here
// degrades gracefully: with no STRIPE_SECRET_KEY the app still builds and runs,
// and the checkout route returns a friendly "payments not configured" error
// instead of throwing.

let cached: Stripe | null | undefined;

/** Lazily construct a Stripe client, or null when no secret key is configured. */
export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  cached = key ? new Stripe(key) : null;
  return cached;
}

/** True when Stripe is configured enough to run Checkout. */
export function stripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** The configured Stripe price ID for a plan, if any. */
export function priceIdFor(plan: PlanId): string | undefined {
  const env = PLANS[plan].priceEnv;
  return process.env[env]?.trim() || undefined;
}

/**
 * Build the `line_items` for a Checkout Session. Prefers a real configured
 * price ID; if none is set, falls back to an inline ad-hoc price so a fresh
 * deployment can still take a payment without first creating Products in the
 * Stripe dashboard. (Subscriptions require a recurring price, so the inline
 * fallback there is monthly.)
 */
export function lineItemsFor(plan: PlanId): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const priceId = priceIdFor(plan);
  if (priceId) return [{ price: priceId, quantity: 1 }];

  const cfg = PLANS[plan];
  return [
    {
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: cfg.amount,
        ...(cfg.mode === 'subscription' ? { recurring: { interval: 'month' as const } } : {}),
        product_data: {
          name: `DadMode Pro — ${cfg.name}`,
          description: 'Full access to the DadMode dad toolkit through the birth.',
        },
      },
    },
  ];
}
