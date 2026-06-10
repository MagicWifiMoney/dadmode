import { NextResponse } from 'next/server';
import { getStripe, lineItemsFor } from '@/lib/stripe';
import { PLANS, isPlanId } from '@/lib/plans';
import { createRateLimiter } from '@/lib/rateLimit';
import { siteUrl } from '@/lib/site';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 10 checkout attempts per IP per minute — enough for fumbled clicks, not abuse.
const rateLimit = createRateLimiter({ limit: 10, windowMs: 60_000 });

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

/** Best-effort request origin, so success/cancel URLs work on any deployment. */
function originFrom(req: Request): string {
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  return host ? `${proto}://${host}` : siteUrl;
}

export async function POST(req: Request) {
  try {
    const limit = rateLimit(clientIp(req));
    if (!limit.allowed) {
      const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
      return NextResponse.json(
        { error: 'Too many attempts. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      );
    }

    let body: { plan?: unknown; email?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!isPlanId(body.plan)) {
      return NextResponse.json({ error: 'Unknown plan' }, { status: 400 });
    }
    const plan = body.plan;

    const email =
      typeof body.email === 'string' && EMAIL_RE.test(body.email.trim())
        ? body.email.trim().toLowerCase()
        : undefined;

    const stripe = getStripe();
    if (!stripe) {
      // Mirrors the Resend pattern: no keys configured → honest, friendly error.
      return NextResponse.json(
        { error: 'Payments aren’t set up yet. Add STRIPE_SECRET_KEY to enable checkout.' },
        { status: 503 },
      );
    }

    const origin = originFrom(req);
    const session = await stripe.checkout.sessions.create({
      mode: PLANS[plan].mode,
      line_items: lineItemsFor(plan),
      ...(email ? { customer_email: email } : {}),
      allow_promotion_codes: true,
      metadata: { plan },
      success_url: `${origin}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=1`,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
