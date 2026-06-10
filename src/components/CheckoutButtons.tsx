'use client';

import { useState } from 'react';
import { PLANS, type PlanId } from '@/lib/plans';
import { getRememberedEmail } from '@/lib/entitlement';

/** The two plan CTAs on the pricing page. Posts to /api/checkout and forwards
 *  the user to Stripe; surfaces a friendly message when payments aren't set up
 *  yet (no STRIPE_SECRET_KEY) so the page never looks broken. */
export default function CheckoutButtons() {
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [error, setError] = useState('');

  async function checkout(plan: PlanId) {
    setError('');
    setLoading(plan);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email: getRememberedEmail() || undefined }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.url) {
        window.location.assign(data.url as string);
        return;
      }
      setError(data?.error || 'Could not start checkout. Please try again.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="checkout-buttons">
      <div className="plan-grid">
        {(Object.values(PLANS)).map((plan) => (
          <div key={plan.id} className={`plan-card${plan.featured ? ' featured' : ''}`}>
            {plan.featured && <span className="plan-tag">Most popular</span>}
            <h3>{plan.name}</h3>
            <div className="plan-price">
              <span className="plan-amount">{plan.price}</span>
              <span className="plan-cadence">{plan.cadence}</span>
            </div>
            <p className="plan-blurb">{plan.blurb}</p>
            <button
              className={`btn-primary${plan.featured ? '' : ' btn-secondary'}`}
              onClick={() => checkout(plan.id)}
              disabled={loading !== null}
            >
              {loading === plan.id ? 'Starting…' : `Get ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
      {error && <p className="form-error" role="alert" style={{ marginTop: '1rem' }}>{error}</p>}
      <p className="checkout-fine">Secure checkout by Stripe · 7-day refund, no questions asked</p>
    </div>
  );
}
