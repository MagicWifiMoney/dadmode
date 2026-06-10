'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { isPro } from '@/lib/entitlement';
import { PRO_FEATURES } from '@/lib/plans';
import RestoreAccess from '@/components/RestoreAccess';
import HospitalBag from './HospitalBag';
import KickCounter from './KickCounter';
import ContractionTimer from './ContractionTimer';
import BabyNames from './BabyNames';

interface Tab {
  id: string;
  label: string;
  render: () => ReactNode;
}

const TABS: Tab[] = [
  { id: 'bag', label: 'Hospital Bag', render: () => <HospitalBag /> },
  { id: 'kick', label: 'Kick Counter', render: () => <KickCounter /> },
  { id: 'contraction', label: 'Contraction Timer', render: () => <ContractionTimer /> },
  { id: 'names', label: 'Baby Names', render: () => <BabyNames /> },
];

export default function ToolkitClient() {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState('bag');

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setUnlocked(isPro());
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Avoid a flash of locked/unlocked content before we've read storage.
  if (!ready) return <div className="toolkit-loading" aria-hidden />;

  if (!unlocked) {
    return (
      <div className="toolkit-locked">
        <div className="lock-badge"><Lock size={22} /></div>
        <h1>The dad toolkit is Pro.</h1>
        <p className="lede">
          Everything you’ll actually reach for in the third trimester and on the big day. Unlock it
          once and it’s yours through the birth.
        </p>
        <ul className="lock-feature-list">
          {PRO_FEATURES.map((f) => (
            <li key={f.title}><strong>{f.title}</strong> — {f.desc}</li>
          ))}
        </ul>
        <Link href="/pricing" className="btn-primary">See plans — from $6</Link>
        <div className="lock-restore"><RestoreAccess /></div>
      </div>
    );
  }

  const active = TABS.find((t) => t.id === tab) ?? TABS[0];

  return (
    <div className="toolkit">
      <div className="toolkit-head">
        <span className="eyebrow">DadMode Pro</span>
        <h1>Your toolkit</h1>
      </div>
      <div className="toolkit-tabs" role="tablist" aria-label="Toolkit">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === tab}
            className={`toolkit-tab${t.id === tab ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="toolkit-panel" role="tabpanel">
        <h2 className="tool-title">{active.label}</h2>
        {active.render()}
      </div>
    </div>
  );
}
