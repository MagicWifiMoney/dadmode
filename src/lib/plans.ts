// Plan catalog — shared between the client (pricing UI) and server (checkout).
// Contains NO secrets: the actual Stripe price IDs live in env vars, referenced
// here by name so the server can resolve them at request time.

export type PlanId = 'pass' | 'monthly';

export interface Plan {
  id: PlanId;
  name: string;
  /** Display price, e.g. "$29". */
  price: string;
  /** Short cadence label, e.g. "one-time" or "/month". */
  cadence: string;
  /** Stripe Checkout mode. */
  mode: 'payment' | 'subscription';
  /** One-line value framing for the pricing card. */
  blurb: string;
  /** Name of the env var holding this plan's Stripe price ID. */
  priceEnv: string;
  /** Amount in cents — used only as a fallback to build an ad-hoc price when
   *  no priceId is configured, so checkout still works in a fresh deployment. */
  amount: number;
  /** Highlighted as the recommended option in the UI. */
  featured?: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  pass: {
    id: 'pass',
    name: 'Whole Pregnancy Pass',
    price: '$29',
    cadence: 'one-time',
    mode: 'payment',
    blurb: 'Unlock everything through the birth. Pay once, no subscription.',
    priceEnv: 'STRIPE_PRICE_PASS',
    amount: 2900,
    featured: true,
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    price: '$6',
    cadence: '/month',
    mode: 'subscription',
    blurb: 'Month-to-month. Cancel anytime once the baby arrives.',
    priceEnv: 'STRIPE_PRICE_MONTHLY',
    amount: 600,
  },
};

export function isPlanId(value: unknown): value is PlanId {
  return value === 'pass' || value === 'monthly';
}

// What Pro unlocks — single source of truth for the pricing page and upgrade
// prompts so the marketing copy never drifts from what's actually gated.
export const PRO_FEATURES: { title: string; desc: string }[] = [
  { title: 'Hospital Bag Checklist', desc: "His bag, her bag, the baby's bag — nothing forgotten at 3am." },
  { title: 'Kick Counter', desc: 'Track fetal movement to 10 kicks with saved session history.' },
  { title: 'Contraction Timer', desc: 'Times duration and frequency, tells you when it’s really go-time (5-1-1).' },
  { title: 'Baby Name Studio', desc: 'Both of you rate names privately; we surface the matches you both love.' },
  { title: 'Appointment Tracker', desc: 'Every prenatal visit, what it’s for, and what to ask the doctor.' },
  { title: 'What To Say (and Not Say)', desc: 'Week-by-week scripts for the moments you don’t want to fumble.' },
];

export const FREE_FEATURES: string[] = [
  'Week-by-week pregnancy tracker',
  "Baby size + what's developing",
  'What your partner is feeling',
  'One practical dad tip every week',
  'Weekly tips in your inbox',
];
