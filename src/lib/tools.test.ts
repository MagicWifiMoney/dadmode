import { describe, it, expect } from 'vitest';
import {
  summarizeKicks,
  analyzeContractions,
  mutualLikes,
  tallyNames,
  KICK_GOAL,
  type Contraction,
  type BabyName,
} from './tools';

const MIN = 60_000;

describe('summarizeKicks', () => {
  it('returns an empty summary for no kicks', () => {
    const s = summarizeKicks([]);
    expect(s).toEqual({ count: 0, reachedGoal: false, startedAt: null, lastAt: null, elapsedMs: 0 });
  });

  it('counts kicks and computes elapsed time regardless of input order', () => {
    const s = summarizeKicks([3000, 1000, 2000]);
    expect(s.count).toBe(3);
    expect(s.startedAt).toBe(1000);
    expect(s.lastAt).toBe(3000);
    expect(s.elapsedMs).toBe(2000);
    expect(s.reachedGoal).toBe(false);
  });

  it('flags reaching the goal', () => {
    const ts = Array.from({ length: KICK_GOAL }, (_, i) => i * 1000);
    expect(summarizeKicks(ts).reachedGoal).toBe(true);
  });
});

describe('analyzeContractions', () => {
  const now = 100 * MIN;

  it('reports the none stage with no completed contractions', () => {
    expect(analyzeContractions([], now).stage).toBe('none');
    // an in-progress contraction (no end) doesn't count yet
    expect(analyzeContractions([{ start: now - MIN, end: null }], now).stage).toBe('none');
  });

  it('detects the 5-1-1 go-now pattern', () => {
    const contractions: Contraction[] = [25, 20, 15, 10, 5].map((m) => ({
      start: now - m * MIN,
      end: now - m * MIN + 60_000, // 60s long
    }));
    const a = analyzeContractions(contractions, now);
    expect(a.stage).toBe('go-now');
    expect(a.avgDurationSec).toBe(60);
    expect(a.avgIntervalMin).toBe(5);
    expect(a.recommendation).toMatch(/5-1-1/);
  });

  it('reports active labor when contractions are ~8 minutes apart', () => {
    const contractions: Contraction[] = [24, 16, 8].map((m) => ({
      start: now - m * MIN,
      end: now - m * MIN + 50_000,
    }));
    expect(analyzeContractions(contractions, now).stage).toBe('active');
  });

  it('ignores contractions older than an hour', () => {
    const contractions: Contraction[] = [{ start: now - 90 * MIN, end: now - 90 * MIN + 60_000 }];
    expect(analyzeContractions(contractions, now).count).toBe(0);
  });
});

describe('baby name tallies', () => {
  const names: BabyName[] = [
    { id: '1', name: 'Avery', dadLikes: true, momLikes: true },
    { id: '2', name: 'Rowan', dadLikes: true, momLikes: false },
    { id: '3', name: 'Sage', dadLikes: false, momLikes: true },
    { id: '4', name: 'Quinn', dadLikes: false, momLikes: false },
  ];

  it('surfaces only mutual likes', () => {
    expect(mutualLikes(names).map((n) => n.name)).toEqual(['Avery']);
  });

  it('tallies by category', () => {
    expect(tallyNames(names)).toEqual({ total: 4, dadOnly: 1, momOnly: 1, mutual: 1 });
  });
});
