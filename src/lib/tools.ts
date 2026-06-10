// Pure logic for the Pro toolkit. Kept free of React/DOM so it can be unit
// tested in isolation; the components are thin shells over these functions.

// ----------------------------- Kick Counter -------------------------------

export const KICK_GOAL = 10;

export interface KickSummary {
  count: number;
  reachedGoal: boolean;
  startedAt: number | null;
  lastAt: number | null;
  /** Milliseconds between the first and most recent kick. */
  elapsedMs: number;
}

/**
 * Summarize a kick-counting session. Clinicians often suggest timing how long
 * it takes to feel 10 distinct movements; a healthy baby usually gets there
 * well within two hours.
 */
export function summarizeKicks(timestamps: number[], goal: number = KICK_GOAL): KickSummary {
  if (timestamps.length === 0) {
    return { count: 0, reachedGoal: false, startedAt: null, lastAt: null, elapsedMs: 0 };
  }
  const sorted = [...timestamps].sort((a, b) => a - b);
  const startedAt = sorted[0];
  const lastAt = sorted[sorted.length - 1];
  return {
    count: sorted.length,
    reachedGoal: sorted.length >= goal,
    startedAt,
    lastAt,
    elapsedMs: lastAt - startedAt,
  };
}

// --------------------------- Contraction Timer ----------------------------

export interface Contraction {
  /** Epoch ms when the contraction started. */
  start: number;
  /** Epoch ms when it ended, or null if still in progress. */
  end: number | null;
}

export type LaborStage = 'none' | 'early' | 'active' | 'go-now';

export interface ContractionAnalysis {
  /** Number of completed contractions considered. */
  count: number;
  /** Average completed-contraction duration, in seconds. */
  avgDurationSec: number;
  /** Average interval between contraction starts, in minutes. */
  avgIntervalMin: number;
  stage: LaborStage;
  recommendation: string;
}

const MIN = 60_000;

/**
 * Analyze a list of contractions using the common "5-1-1" guideline: when
 * contractions are ~5 minutes apart, each lasting ~1 minute, sustained for an
 * hour, it's typically time to head to the hospital. This is guidance, not
 * medical advice — the copy says so.
 *
 * Only the last hour of contractions is considered so a long-ago practice run
 * doesn't skew the averages.
 */
export function analyzeContractions(
  contractions: Contraction[],
  now: number = Date.now(),
): ContractionAnalysis {
  const completed = contractions
    .filter((c): c is { start: number; end: number } => c.end != null && c.end > c.start)
    .filter((c) => now - c.start <= 60 * MIN)
    .sort((a, b) => a.start - b.start);

  if (completed.length === 0) {
    return {
      count: 0,
      avgDurationSec: 0,
      avgIntervalMin: 0,
      stage: 'none',
      recommendation: 'Start timing when a contraction begins. We’ll track the pattern for you.',
    };
  }

  const avgDurationSec =
    completed.reduce((sum, c) => sum + (c.end - c.start), 0) / completed.length / 1000;

  let avgIntervalMin = 0;
  if (completed.length >= 2) {
    let total = 0;
    for (let i = 1; i < completed.length; i++) total += completed[i].start - completed[i - 1].start;
    avgIntervalMin = total / (completed.length - 1) / MIN;
  }

  const fiveOneOne = avgIntervalMin > 0 && avgIntervalMin <= 5 && avgDurationSec >= 45;
  let stage: LaborStage;
  let recommendation: string;

  if (fiveOneOne && completed.length >= 4) {
    stage = 'go-now';
    recommendation = 'This matches the 5-1-1 pattern. Call your provider and head in — bring the hospital bag.';
  } else if (avgIntervalMin > 0 && avgIntervalMin <= 10) {
    stage = 'active';
    recommendation = 'Contractions are getting closer. Keep timing and get ready to call your provider.';
  } else {
    stage = 'early';
    recommendation = 'Early labor. Rest, hydrate, and keep timing — things usually pick up gradually.';
  }

  return {
    count: completed.length,
    avgDurationSec: Math.round(avgDurationSec),
    avgIntervalMin: Math.round(avgIntervalMin * 10) / 10,
    stage,
    recommendation,
  };
}

// ---------------------------- Baby Name Studio ----------------------------

export interface BabyName {
  id: string;
  name: string;
  /** Whose shortlist: a name can be liked by either or both partners. */
  dadLikes: boolean;
  momLikes: boolean;
}

/** Names both partners marked — the shortlist that actually matters. */
export function mutualLikes(names: BabyName[]): BabyName[] {
  return names.filter((n) => n.dadLikes && n.momLikes);
}

export interface NameTally {
  total: number;
  dadOnly: number;
  momOnly: number;
  mutual: number;
}

export function tallyNames(names: BabyName[]): NameTally {
  let dadOnly = 0;
  let momOnly = 0;
  let mutual = 0;
  for (const n of names) {
    if (n.dadLikes && n.momLikes) mutual++;
    else if (n.dadLikes) dadOnly++;
    else if (n.momLikes) momOnly++;
  }
  return { total: names.length, dadOnly, momOnly, mutual };
}
