'use client';

import { useState } from 'react';
import { setPro, rememberEmail } from '@/lib/entitlement';

/** Lets a returning customer on a new device re-unlock Pro by email, checking
 *  the entitlements table written by the Stripe webhook. */
export default function RestoreAccess() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'none' | 'error'>('idle');

  async function restore(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState('loading');
    try {
      const res = await fetch('/api/entitlement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.active) {
        rememberEmail(email.trim().toLowerCase());
        setPro(data.plan);
        setState('ok');
      } else {
        setState('none');
      }
    } catch {
      setState('error');
    }
  }

  if (state === 'ok') {
    return (
      <p className="restore-result ok">
        Access restored. <a href="/toolkit">Open the toolkit →</a>
      </p>
    );
  }

  return (
    <form className="restore-form" onSubmit={restore}>
      <label htmlFor="restore-email">Already bought Pro? Restore access</label>
      <div className="email-input-row">
        <input
          id="restore-email"
          type="email"
          placeholder="The email you used at checkout"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={state === 'loading'}>
          {state === 'loading' ? '…' : 'Restore'}
        </button>
      </div>
      {state === 'none' && <p className="form-error" role="alert">No active purchase found for that email.</p>}
      {state === 'error' && <p className="form-error" role="alert">Something went wrong. Try again.</p>}
    </form>
  );
}
