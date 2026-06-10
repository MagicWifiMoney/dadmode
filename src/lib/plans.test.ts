import { describe, it, expect } from 'vitest';
import { PLANS, isPlanId, PRO_FEATURES, FREE_FEATURES } from './plans';

describe('plans', () => {
  it('validates plan ids', () => {
    expect(isPlanId('pass')).toBe(true);
    expect(isPlanId('monthly')).toBe(true);
    expect(isPlanId('lifetime')).toBe(false);
    expect(isPlanId(undefined)).toBe(false);
    expect(isPlanId(42)).toBe(false);
  });

  it('keeps the one-time pass as a payment and monthly as a subscription', () => {
    expect(PLANS.pass.mode).toBe('payment');
    expect(PLANS.monthly.mode).toBe('subscription');
  });

  it('exposes non-empty feature copy for the pricing page', () => {
    expect(PRO_FEATURES.length).toBeGreaterThan(0);
    expect(FREE_FEATURES.length).toBeGreaterThan(0);
    for (const f of PRO_FEATURES) {
      expect(f.title.length).toBeGreaterThan(0);
      expect(f.desc.length).toBeGreaterThan(0);
    }
  });
});
