'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { setPro, rememberEmail, demoUnlockEnabled } from '@/lib/entitlement';

type Status = 'verifying' | 'unlocked' | 'pending' | 'error';

export default function UnlockPro({ sessionId }: { sessionId?: string }) {
  const [status, setStatus] = useState<Status>(sessionId ? 'verifying' : 'pending');
  const [plan, setPlan] = useState<string>('pass');

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    // Demo builds can unlock without a real session, for local exploration.
    if (!sessionId && demoUnlockEnabled()) {
      setPro('pass');
      setStatus('unlocked');
      return;
    }
    if (!sessionId) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/entitlement?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (res.ok && data?.active) {
          if (data.email) rememberEmail(String(data.email).toLowerCase());
          setPro(data.plan ?? 'pass');
          setPlan(data.plan ?? 'pass');
          setStatus('unlocked');
        } else {
          setStatus('pending');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (status === 'verifying') {
    return <div className="unlock-card"><p>Confirming your purchase…</p></div>;
  }

  if (status === 'unlocked') {
    return (
      <div className="unlock-card success">
        <div className="unlock-badge"><Check size={28} /></div>
        <h1>You’re in. Welcome to DadMode Pro.</h1>
        <p>
          The full toolkit is unlocked on this device{plan === 'monthly' ? ' for your subscription' : ''}.
          Bookmark it — you’ll be back here at 3am one day soon.
        </p>
        <Link href="/toolkit" className="btn-primary">Open the toolkit →</Link>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="unlock-card">
        <h1>We couldn’t confirm that just yet.</h1>
        <p>Your payment may still be processing. Refresh in a minute, or restore access from the pricing page.</p>
        <Link href="/pricing" className="btn-secondary">Back to pricing</Link>
      </div>
    );
  }

  return (
    <div className="unlock-card">
      <h1>Almost there.</h1>
      <p>
        If you just paid, hang tight a moment while Stripe finishes — or head to pricing and use
        “Restore access” with your email.
      </p>
      <Link href="/pricing" className="btn-secondary">Go to pricing</Link>
    </div>
  );
}
