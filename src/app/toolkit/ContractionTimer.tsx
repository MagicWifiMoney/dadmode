'use client';

import { useEffect, useState } from 'react';
import { useLocalState } from '@/components/useLocalState';
import { analyzeContractions, type Contraction } from '@/lib/tools';

function fmtClock(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function ContractionTimer() {
  const [contractions, setContractions] = useLocalState<Contraction[]>('dadmode_contractions', []);
  const [now, setNow] = useState(0);

  const active = contractions.find((c) => c.end == null) ?? null;

  // Keep `now` current for the analysis, and tick once a second while a
  // contraction is actually running so the live clock advances.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setNow(Date.now());
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function start() {
    setContractions((list) => [...list, { start: Date.now(), end: null }]);
  }

  function stop() {
    setContractions((list) =>
      list.map((c) => (c.end == null ? { ...c, end: Date.now() } : c)),
    );
  }

  function clearAll() {
    if (confirm('Clear all timed contractions?')) setContractions([]);
  }

  const analysis = analyzeContractions(contractions, now);
  const recent = [...contractions].filter((c) => c.end != null).reverse().slice(0, 8);

  const stageClass =
    analysis.stage === 'go-now' ? 'stage-go' : analysis.stage === 'active' ? 'stage-active' : 'stage-early';

  return (
    <div className="tool">
      <p className="tool-intro">
        Press start when a contraction begins and stop when it ends. We’ll track duration and how
        far apart they are, and flag the 5-1-1 pattern that usually means it’s time to go.
      </p>

      <div className="contraction-live">
        {active ? (
          <>
            <div className="contraction-clock running">{fmtClock(Math.max(0, now - active.start))}</div>
            <button className="btn-primary contraction-btn stop" onClick={stop}>Contraction ended</button>
          </>
        ) : (
          <>
            <div className="contraction-clock">0:00</div>
            <button className="btn-primary contraction-btn" onClick={start}>Start contraction</button>
          </>
        )}
      </div>

      {analysis.count > 0 && (
        <div className={`contraction-readout ${stageClass}`}>
          <div className="readout-stats">
            <div><span className="readout-num">{analysis.avgDurationSec}s</span><span className="readout-label">avg length</span></div>
            <div><span className="readout-num">{analysis.avgIntervalMin || '—'}{analysis.avgIntervalMin ? 'm' : ''}</span><span className="readout-label">apart</span></div>
            <div><span className="readout-num">{analysis.count}</span><span className="readout-label">last hour</span></div>
          </div>
          <p className="readout-rec">{analysis.recommendation}</p>
        </div>
      )}

      {recent.length > 0 && (
        <div className="tool-history">
          <div className="history-head">
            <h4>Recent contractions</h4>
            <button className="link-btn" onClick={clearAll}>Clear</button>
          </div>
          <ul>
            {recent.map((c, i) => (
              <li key={`${c.start}-${i}`}>
                <span>{new Date(c.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                <span>lasted {fmtClock((c.end as number) - c.start)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="tool-disclaimer">
        This is a guideline, not medical advice. If her water breaks, there’s bleeding, or your
        provider gave you different instructions, follow those and call them.
      </p>
    </div>
  );
}
