"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mail, RefreshCw, Check } from 'lucide-react';
import { weekData, type WeekData } from './data';
import {
  STORAGE_KEY,
  computeStats,
  dueDateFromLmp,
  trimesterLabel,
  hormoneClass,
  weekContent,
  type Stats,
} from '@/lib/pregnancy';

function WeekCard({ data, highlight }: { data: WeekData; highlight?: boolean }) {
  return (
    <div className={`week-card${highlight ? ' highlight' : ''}`}>
      <div className="card-header">
        <div className="baby-icon">{data.icon}</div>
        <div className="card-header-text">
          <h3>Week {data.week}</h3>
          <div className="baby-size">📏 {data.size}</div>
        </div>
      </div>
      <div className="info-grid">
        <div className="info-block">
          <div className="info-block-label">🍼 Baby</div>
          <div className="info-block-text">{data.baby}</div>
        </div>
        <div className="info-block">
          <div className="info-block-label">💛 Partner</div>
          <div className="info-block-text">{data.partner}</div>
        </div>
      </div>
      <div className="dad-tip">
        <div className="dad-tip-label">⚡ Dad Tip</div>
        <div className="dad-tip-text">{data.dadTip}</div>
      </div>
      <div className="hormone-chip">
        <span className={`hormone-level ${hormoneClass(data.hormone.level)}`}>
          {data.hormone.level.replace('-', '/').toUpperCase()}
        </span>
        <span className="hormone-note">{data.hormone.note}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  // Onboarding inputs
  const [mode, setMode] = useState<'lmp' | 'due'>('lmp');
  const [lmpValue, setLmpValue] = useState('');
  const [dueValue, setDueValue] = useState('');
  const [error, setError] = useState('');

  // Dashboard interaction
  const [progressWidth, setProgressWidth] = useState(0);
  const [modalWeek, setModalWeek] = useState<number | null>(null);

  // Email capture
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  const currentPillRef = useRef<HTMLButtonElement>(null);

  // Hydrate from localStorage once on mount. The server (and the client's first
  // render) show onboarding with dueDate=null, so there's no hydration mismatch;
  // a returning user is then upgraded to the dashboard. Reading a client-only
  // store after render is exactly what an effect is for, so the rule is disabled.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const d = new Date(saved);
      if (!Number.isNaN(d.getTime())) {
        setDueDate(d);
        setStats(computeStats(d));
      }
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Animate the progress bar from 0 -> pct after the dashboard mounts. The
  // setState runs inside a timeout (not synchronously), so no cascading render.
  useEffect(() => {
    if (!stats) return;
    const id = setTimeout(() => setProgressWidth(stats.pct), 100);
    return () => clearTimeout(id);
  }, [stats]);

  // Center the current week in the timeline once the dashboard renders.
  useEffect(() => {
    if (!stats) return;
    const id = setTimeout(() => {
      currentPillRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, 400);
    return () => clearTimeout(id);
  }, [stats]);

  // Lock background scroll and allow Escape-to-close while the modal is open.
  useEffect(() => {
    if (!modalWeek) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalWeek(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [modalWeek]);

  const startApp = () => {
    let d: Date;
    // Auto-detect which field was filled, regardless of the active tab.
    if (mode === 'due' || (!lmpValue && dueValue)) {
      if (!dueValue) {
        setError('Please enter your due date.');
        return;
      }
      d = new Date(dueValue + 'T12:00:00'); // noon avoids timezone shifts
    } else {
      if (!lmpValue) {
        setError('Please enter the first day of her last period.');
        return;
      }
      const lmp = new Date(lmpValue + 'T12:00:00');
      d = dueDateFromLmp(lmp);
    }
    setError('');
    setDueDate(d);
    setStats(computeStats(d));
    localStorage.setItem(STORAGE_KEY, d.toISOString());
  };

  const resetApp = () => {
    if (!confirm('Reset your dates and start over?')) return;
    localStorage.removeItem(STORAGE_KEY);
    setDueDate(null);
    setStats(null);
    setLmpValue('');
    setDueValue('');
    setMode('lmp');
    setError('');
    setSubmitted(false);
    setEmail('');
    setSubscribeError('');
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    setSubscribeError('');
    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        body: JSON.stringify({ email, dueDate: dueDate?.toISOString() }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => null);
        setSubscribeError(data?.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubscribeError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== ONBOARDING ====================
  if (!dueDate || !stats) {
    return (
      <div id="onboarding">
        <div className="logo-icon">🍼</div>
        <h1 className="logo-title">Dad<span>Mode</span></h1>
        <div className="logo-sub">Your pregnancy companion, built for you</div>

        <div className="onboarding-card animate-in">
          <h2>Let&apos;s get you set up</h2>
          <p>Track your partner&apos;s pregnancy week-by-week with insights made for dads — not doctors.</p>

          <div className="option-tabs" role="tablist" aria-label="Date entry method">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'lmp'}
              className={`tab-btn${mode === 'lmp' ? ' active' : ''}`}
              onClick={() => setMode('lmp')}
            >
              Last Period Date
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'due'}
              className={`tab-btn${mode === 'due' ? ' active' : ''}`}
              onClick={() => setMode('due')}
            >
              Due Date
            </button>
          </div>

          {mode === 'lmp' ? (
            <div className="date-input-wrap">
              <label htmlFor="lmp-date">First Day of Last Period</label>
              <input
                id="lmp-date"
                type="date"
                value={lmpValue}
                onChange={(e) => setLmpValue(e.target.value)}
              />
            </div>
          ) : (
            <div className="date-input-wrap">
              <label htmlFor="due-date">Estimated Due Date</label>
              <input
                id="due-date"
                type="date"
                value={dueValue}
                onChange={(e) => setDueValue(e.target.value)}
              />
            </div>
          )}

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="btn-primary" onClick={startApp}>Let&apos;s Go →</button>
        </div>
      </div>
    );
  }

  // ==================== DASHBOARD ====================
  const { daysLeft, daysDone, pct, week } = stats;
  const trimester = trimesterLabel(week);
  const dueFmt = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const currentData = weekContent(week);
  const nextWeek = Math.min(40, week + 1);
  const modalData = modalWeek ? weekData[modalWeek - 1] : null;

  return (
    <div id="dashboard" style={{ display: 'block' }}>
      <div className="dash-header">
        <h1 className="dash-logo">Dad<span>Mode</span></h1>
        <button className="btn-reset" onClick={resetApp}>
          <RefreshCw size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} /> Reset
        </button>
      </div>

      <div className="dash-hero">
        <div className="week-number-big">{week}</div>
        <div className="week-label">WEEKS PREGNANT</div>
        <div className="trimester-badge">{trimester}</div>
      </div>

      <div className="stats-row">
        <div className="stat-block">
          <span className="stat-number">{daysLeft}</span>
          <span className="stat-label">Days Left</span>
        </div>
        <div className="stat-block">
          <span className="stat-number">{daysDone}</span>
          <span className="stat-label">Days In</span>
        </div>
        <div className="stat-block">
          <span className="stat-number">{pct}%</span>
          <span className="stat-label">Complete</span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-meta">
          <span>Week 1</span>
          <span>Due {dueFmt}</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progressWidth}%` }}></div>
        </div>
        <div className="trimester-markers">
          <span className="t-marker">T1 wk 1-13</span>
          <span className="t-marker">T2 wk 14-26</span>
          <span className="t-marker">T3 wk 27-40</span>
        </div>
      </div>

      <div className="section-pad">
        <h2 className="section-title">This week</h2>
        <WeekCard data={currentData} highlight />
      </div>

      <div className="section-pad">
        <div className="email-capture">
          {!submitted ? (
            <form onSubmit={handleSubscribe}>
              <h2>Get weekly dad tips in your inbox</h2>
              <p>We&apos;ll send Week {nextWeek}&apos;s tip straight to you.</p>
              <div className="email-input-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" disabled={isSubmitting} aria-label="Subscribe">
                  {isSubmitting ? '…' : <Mail size={20} />}
                </button>
              </div>
              {subscribeError && (
                <p className="form-error" role="alert" style={{ margin: '0.75rem 0 0' }}>
                  {subscribeError}
                </p>
              )}
            </form>
          ) : (
            <div className="success-msg">
              <Check size={20} className="success-check" />
              <p>You&apos;re in. See you next week.</p>
            </div>
          )}
        </div>
      </div>

      <div className="timeline-section">
        <h2 className="timeline-title">All 40 Weeks</h2>
        <div className="timeline-scroller">
          {weekData.map((w) => {
            const isCurrent = w.week === week;
            return (
              <button
                key={w.week}
                ref={isCurrent ? currentPillRef : undefined}
                className={`t-week-pill${isCurrent ? ' current' : ''}${w.week < week ? ' past' : ''}`}
                onClick={() => setModalWeek(w.week)}
                aria-label={`View week ${w.week} details`}
              >
                <span className="t-pill-num">{w.week}</span>
                <span className="t-pill-icon">{w.icon}</span>
                <span className="t-pill-label">wk {w.week}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`modal-overlay${modalWeek ? ' open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModalWeek(null);
        }}
      >
        <div className="modal-sheet" role="dialog" aria-modal="true">
          <div className="modal-handle"></div>
          {modalData && <WeekCard data={modalData} />}
          <button className="modal-close" onClick={() => setModalWeek(null)} aria-label="Close">✕</button>
        </div>
      </div>
    </div>
  );
}
