'use client';

import { useState } from 'react';
import { useLocalState } from '@/components/useLocalState';
import { mutualLikes, tallyNames, type BabyName } from '@/lib/tools';

export default function BabyNames() {
  const [names, setNames] = useLocalState<BabyName[]>('dadmode_names', []);
  const [draft, setDraft] = useState('');

  function add() {
    const name = draft.trim();
    if (!name) return;
    if (names.some((n) => n.name.toLowerCase() === name.toLowerCase())) {
      setDraft('');
      return;
    }
    setNames((list) => [
      { id: `${Date.now()}`, name, dadLikes: false, momLikes: false },
      ...list,
    ]);
    setDraft('');
  }

  function toggle(id: string, who: 'dadLikes' | 'momLikes') {
    setNames((list) => list.map((n) => (n.id === id ? { ...n, [who]: !n[who] } : n)));
  }

  function remove(id: string) {
    setNames((list) => list.filter((n) => n.id !== id));
  }

  const tally = tallyNames(names);
  const matches = mutualLikes(names);

  return (
    <div className="tool">
      <p className="tool-intro">
        Add names you’re both mulling. Each of you taps the heart for the ones you like — the names
        you <em>both</em> love float to the top. No more awkward veto standoffs.
      </p>

      <div className="name-add">
        <input
          type="text"
          placeholder="Add a name…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
        />
        <button className="btn-primary" onClick={add}>Add</button>
      </div>

      {names.length > 0 && (
        <div className="name-tally">
          <span><strong>{tally.total}</strong> names</span>
          <span className="match"><strong>{tally.mutual}</strong> mutual</span>
          <span><strong>{tally.dadOnly}</strong> dad-only</span>
          <span><strong>{tally.momOnly}</strong> mom-only</span>
        </div>
      )}

      {matches.length > 0 && (
        <div className="name-matches">
          <h4>You both love</h4>
          <div className="match-chips">
            {matches.map((n) => <span key={n.id} className="match-chip">{n.name}</span>)}
          </div>
        </div>
      )}

      <ul className="name-list">
        {names.map((n) => {
          const both = n.dadLikes && n.momLikes;
          return (
            <li key={n.id} className={both ? 'both' : ''}>
              <span className="name-text">{n.name}</span>
              <div className="name-votes">
                <button
                  className={`vote${n.dadLikes ? ' on' : ''}`}
                  onClick={() => toggle(n.id, 'dadLikes')}
                  aria-pressed={n.dadLikes}
                >Dad ♥</button>
                <button
                  className={`vote${n.momLikes ? ' on' : ''}`}
                  onClick={() => toggle(n.id, 'momLikes')}
                  aria-pressed={n.momLikes}
                >Mom ♥</button>
                <button className="vote remove" onClick={() => remove(n.id)} aria-label={`Remove ${n.name}`}>×</button>
              </div>
            </li>
          );
        })}
      </ul>

      {names.length === 0 && <p className="tool-empty">No names yet. Add the first one above.</p>}
    </div>
  );
}
