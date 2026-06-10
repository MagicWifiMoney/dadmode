import { describe, it, expect } from 'vitest';
import {
  nextAppointment,
  currentAppointment,
  weekTodo,
  weekTodos,
  partnerScript,
} from './content';

describe('appointment schedule', () => {
  it('finds the next appointment due at or after a week', () => {
    expect(nextAppointment(20)?.week).toBe(20);
    expect(nextAppointment(21)?.week).toBe(24);
    expect(nextAppointment(1)?.week).toBe(8);
  });

  it('returns null when no further appointments are scheduled', () => {
    expect(nextAppointment(40)).toBeNull();
  });

  it('finds the most recent appointment at or before a week', () => {
    expect(currentAppointment(22)?.week).toBe(20);
    expect(currentAppointment(7)).toBeNull();
  });
});

describe('weekly to-dos', () => {
  it('has a to-do for every week 1-40', () => {
    for (let w = 1; w <= 40; w++) {
      expect(typeof weekTodos[w]).toBe('string');
      expect(weekTodos[w].length).toBeGreaterThan(0);
    }
  });

  it('falls back gracefully for an out-of-range week', () => {
    expect(weekTodo(99)).toMatch(/present/i);
  });
});

describe('partner scripts', () => {
  it('returns a curated script for a key week', () => {
    expect(partnerScript(20).say).toMatch(/scan/i);
  });

  it('falls back to a trimester-appropriate script', () => {
    // Week 2 has no curated script -> first-trimester fallback
    const s = partnerScript(2);
    expect(s.say.length).toBeGreaterThan(0);
    expect(s.dont.length).toBeGreaterThan(0);
    expect(s.why.length).toBeGreaterThan(0);
  });
});
