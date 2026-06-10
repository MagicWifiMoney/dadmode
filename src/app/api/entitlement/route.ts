import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * GET /api/entitlement?session_id=cs_...
 * Confirms a just-completed Checkout Session was actually paid before the
 * client unlocks Pro. Returns { active, plan, email } so /welcome can both
 * unlock and pre-fill the email-capture form.
 */
export async function GET(req: Request) {
  const stripe = getStripe();
  const sessionId = new URL(req.url).searchParams.get('session_id');

  if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  if (!stripe) return NextResponse.json({ active: false, reason: 'payments_disabled' });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid' || session.status === 'complete';
    return NextResponse.json({
      active: paid,
      plan: (session.metadata?.plan as string) ?? 'pass',
      email: session.customer_details?.email ?? session.customer_email ?? null,
    });
  } catch (err) {
    console.error('Entitlement verify error:', err);
    return NextResponse.json({ active: false, error: 'verify_failed' }, { status: 502 });
  }
}

/**
 * POST { email } — "Restore access". Looks up the entitlements table (written
 * by the Stripe webhook) so someone on a new device can re-unlock Pro by email.
 */
export async function POST(req: Request) {
  let body: { email?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('entitlements')
      .select('plan, status')
      .eq('email', email)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      console.error('Entitlement lookup error:', error);
      return NextResponse.json({ active: false }, { status: 200 });
    }
    return NextResponse.json({ active: Boolean(data), plan: data?.plan ?? null });
  } catch (err) {
    console.error('Entitlement restore error:', err);
    return NextResponse.json({ active: false }, { status: 200 });
  }
}
