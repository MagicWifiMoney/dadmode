import { weekData, type WeekData } from '@/app/data';

/** Length of a full-term pregnancy in days (40 weeks). */
export const TOTAL_DAYS = 280;
export const MS_PER_DAY = 86400000;
/** localStorage key for the persisted due date (ISO string). */
export const STORAGE_KEY = 'dadmode_due';

export interface Stats {
  /** Whole days remaining until the due date (never negative). */
  daysLeft: number;
  /** Whole days elapsed since conception baseline (0..280). */
  daysDone: number;
  /** Percentage complete (0..100, integer). */
  pct: number;
  /** Current pregnancy week (1..40). */
  week: number;
}

/**
 * Derive pregnancy progress stats from a due date.
 * Clamps to sane bounds so a far-future or past due date can't produce
 * negative days or out-of-range weeks.
 */
export function computeStats(due: Date, today: Date = new Date()): Stats {
  const daysLeft = Math.max(0, Math.floor((due.getTime() - today.getTime()) / MS_PER_DAY));
  const daysDone = Math.min(TOTAL_DAYS, Math.max(0, TOTAL_DAYS - daysLeft));
  const pct = Math.min(100, Math.max(0, Math.round((daysDone / TOTAL_DAYS) * 100)));
  const week = Math.min(40, Math.max(1, Math.floor(daysDone / 7) + 1));
  return { daysLeft, daysDone, pct, week };
}

/** Estimate a due date from the first day of the last menstrual period. */
export function dueDateFromLmp(lmp: Date): Date {
  const due = new Date(lmp);
  due.setDate(due.getDate() + TOTAL_DAYS);
  return due;
}

/** Map a week number (1..40) to its trimester label. */
export function trimesterLabel(week: number): string {
  if (week <= 13) return 'First Trimester';
  if (week <= 26) return 'Second Trimester';
  return 'Third Trimester';
}

/** Map a hormone intensity level to its CSS chip class. */
export function hormoneClass(level: string): string {
  switch (level) {
    case 'high':
    case 'medium-high':
      return 'hl-high';
    case 'low':
      return 'hl-low';
    default:
      return 'hl-medium';
  }
}

/** Get the week's content, falling back to week 40 for out-of-range input. */
export function weekContent(week: number): WeekData {
  return weekData[week - 1] || weekData[39];
}
