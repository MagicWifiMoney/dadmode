import { describe, it, expect } from 'vitest';
import {
  TOTAL_DAYS,
  computeStats,
  dueDateFromLmp,
  trimesterLabel,
  hormoneClass,
  weekContent,
} from './pregnancy';

const day = (iso: string) => new Date(iso + 'T12:00:00');

describe('computeStats', () => {
  it('reports week 1 / 0% the day a 280-day pregnancy begins', () => {
    const today = day('2026-01-01');
    const due = new Date(today);
    due.setDate(due.getDate() + TOTAL_DAYS);
    const s = computeStats(due, today);
    expect(s.daysLeft).toBe(280);
    expect(s.daysDone).toBe(0);
    expect(s.pct).toBe(0);
    expect(s.week).toBe(1);
  });

  it('reports week 40 / 100% on the due date', () => {
    const today = day('2026-01-01');
    const s = computeStats(today, today);
    expect(s.daysLeft).toBe(0);
    expect(s.daysDone).toBe(280);
    expect(s.pct).toBe(100);
    expect(s.week).toBe(40);
  });

  it('computes a sensible mid-pregnancy week (20 weeks in)', () => {
    const today = day('2026-01-01');
    const due = new Date(today);
    due.setDate(due.getDate() + 140); // 140 days left => 140 done
    const s = computeStats(due, today);
    expect(s.daysDone).toBe(140);
    expect(s.week).toBe(21); // floor(140/7)+1
    expect(s.pct).toBe(50);
  });

  it('clamps a past due date to week 40 / 100% (never negative)', () => {
    const today = day('2026-06-01');
    const due = day('2026-01-01'); // already past
    const s = computeStats(due, today);
    expect(s.daysLeft).toBe(0);
    expect(s.daysDone).toBe(280);
    expect(s.pct).toBe(100);
    expect(s.week).toBe(40);
  });

  it('clamps a far-future due date to week 1 / 0% (no negative days)', () => {
    const today = day('2026-01-01');
    const due = day('2027-06-01'); // >280 days out
    const s = computeStats(due, today);
    expect(s.daysDone).toBe(0);
    expect(s.pct).toBe(0);
    expect(s.week).toBe(1);
  });
});

describe('dueDateFromLmp', () => {
  it('adds 280 days to the last period date', () => {
    const lmp = day('2026-01-01');
    const due = dueDateFromLmp(lmp);
    const diff = Math.round((due.getTime() - lmp.getTime()) / 86400000);
    expect(diff).toBe(280);
  });

  it('does not mutate the input date', () => {
    const lmp = day('2026-01-01');
    const before = lmp.getTime();
    dueDateFromLmp(lmp);
    expect(lmp.getTime()).toBe(before);
  });
});

describe('trimesterLabel', () => {
  it.each([
    [1, 'First Trimester'],
    [13, 'First Trimester'],
    [14, 'Second Trimester'],
    [26, 'Second Trimester'],
    [27, 'Third Trimester'],
    [40, 'Third Trimester'],
  ])('week %i -> %s', (week, label) => {
    expect(trimesterLabel(week)).toBe(label);
  });
});

describe('hormoneClass', () => {
  it.each([
    ['high', 'hl-high'],
    ['medium-high', 'hl-high'],
    ['low', 'hl-low'],
    ['medium', 'hl-medium'],
    ['anything-else', 'hl-medium'],
  ])('%s -> %s', (level, cls) => {
    expect(hormoneClass(level)).toBe(cls);
  });
});

describe('weekContent', () => {
  it('returns the matching week', () => {
    expect(weekContent(1).week).toBe(1);
    expect(weekContent(40).week).toBe(40);
  });

  it('falls back to week 40 for out-of-range input', () => {
    expect(weekContent(99).week).toBe(40);
    expect(weekContent(0).week).toBe(40);
  });
});
