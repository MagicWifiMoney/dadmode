'use client';

import { useLocalState } from '@/components/useLocalState';
import { summarizeKicks, KICK_GOAL } from '@/lib/tools';

interface Session {
  startedAt: number;
  lastAt: number;
  count: number;
}

function fmtDuration(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function KickCounter() {
  const [kicks, setKicks] = useLocalState<number[]>('dadmode_kicks', []);
  const [history, setHistory] = useLocalState<Session[]>('dadmode_kick_history', []);

  const summary = summarizeKicks(kicks);

  function addKick() {
    setKicks((k) => [...k, Date.now()]);
  }

  function finish() {
    if (summary.count > 0 && summary.startedAt != null && summary.lastAt != null) {
      setHistory((h) => [
        { startedAt: summary.startedAt!, lastAt: summary.lastAt!, count: summary.count },
        ...h,
      ].slice(0, 10));
    }
    setKicks([]);
  }

  const pct = Math.min(100, (summary.count / KICK_GOAL) * 100);

  return (
    <div className="tool">
      <p className="tool-intro">
        Tap every time you feel a movement. Counting to {KICK_GOAL} is a simple way to check in on
        the baby — most reach {KICK_GOAL} well within two hours.
      </p>

      <div className="kick-display">
        <div className="kick-count">{summary.count}<span>/{KICK_GOAL}</span></div>
        <div className="kick-meta">
          {summary.count > 0 ? `${fmtDuration(summary.elapsedMs)} elapsed` : 'Not started'}
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        {summary.reachedGoal && (
          <p className="kick-goal-hit">Reached {KICK_GOAL} kicks in {fmtDuration(summary.elapsedMs)}. Nice.</p>
        )}
      </div>

      <div className="tool-actions">
        <button className="btn-primary kick-btn" onClick={addKick}>I felt a kick</button>
        <button className="btn-secondary" onClick={finish} disabled={summary.count === 0}>
          {summary.reachedGoal ? 'Save session' : 'Reset'}
        </button>
      </div>

      {history.length > 0 && (
        <div className="tool-history">
          <h4>Recent sessions</h4>
          <ul>
            {history.map((h, i) => (
              <li key={`${h.startedAt}-${i}`}>
                <span>{new Date(h.startedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                <span>{h.count} kicks · {fmtDuration(h.lastAt - h.startedAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="tool-disclaimer">
        If movement feels reduced or different from normal, call your provider right away — don’t wait.
      </p>
    </div>
  );
}
