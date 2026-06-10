'use client';

import { useLocalState } from '@/components/useLocalState';
import { hospitalBagPreset } from '@/lib/content';

export default function HospitalBag() {
  // Map of itemId -> checked. Custom items are appended per group.
  const [checked, setChecked] = useLocalState<Record<string, boolean>>('dadmode_bag_checked', {});
  const [custom, setCustom] = useLocalState<Record<string, string[]>>('dadmode_bag_custom', {});
  const [drafts, setDrafts] = useLocalState<Record<string, string>>('dadmode_bag_drafts', {});

  function toggle(id: string) {
    setChecked((c) => ({ ...c, [id]: !c[id] }));
  }

  function addCustom(groupKey: string) {
    const label = (drafts[groupKey] ?? '').trim();
    if (!label) return;
    setCustom((c) => ({ ...c, [groupKey]: [...(c[groupKey] ?? []), label] }));
    setDrafts((d) => ({ ...d, [groupKey]: '' }));
  }

  const allItems = hospitalBagPreset.flatMap((g) => [
    ...g.items.map((i) => i.id),
    ...((custom[g.key] ?? []).map((_, idx) => `custom-${g.key}-${idx}`)),
  ]);
  const done = allItems.filter((id) => checked[id]).length;
  const total = allItems.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="tool">
      <p className="tool-intro">
        Three bags, packed by week 30. Check things off as they go in. Add your own — every couple
        forgets something different.
      </p>

      <div className="bag-progress">
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span>{done}/{total} packed</span>
      </div>

      <div className="bag-groups">
        {hospitalBagPreset.map((group) => {
          const customItems = custom[group.key] ?? [];
          return (
            <div key={group.key} className="bag-group">
              <h4>{group.title}</h4>
              <ul className="check-list">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <label className={checked[item.id] ? 'checked' : ''}>
                      <input type="checkbox" checked={!!checked[item.id]} onChange={() => toggle(item.id)} />
                      <span>{item.label}</span>
                    </label>
                  </li>
                ))}
                {customItems.map((label, idx) => {
                  const id = `custom-${group.key}-${idx}`;
                  return (
                    <li key={id}>
                      <label className={checked[id] ? 'checked' : ''}>
                        <input type="checkbox" checked={!!checked[id]} onChange={() => toggle(id)} />
                        <span>{label}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              <div className="bag-add">
                <input
                  type="text"
                  placeholder="Add an item…"
                  value={drafts[group.key] ?? ''}
                  onChange={(e) => setDrafts((d) => ({ ...d, [group.key]: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') addCustom(group.key); }}
                />
                <button className="link-btn" onClick={() => addCustom(group.key)}>Add</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
