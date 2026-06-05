import { describe, it, expect } from 'vitest';
import { createRateLimiter } from './rateLimit';

describe('createRateLimiter', () => {
  it('allows up to the limit then blocks within a window', () => {
    const check = createRateLimiter({ limit: 3, windowMs: 1000 });
    expect(check('ip', 0).allowed).toBe(true);
    expect(check('ip', 100).allowed).toBe(true);
    expect(check('ip', 200).allowed).toBe(true);
    const blocked = check('ip', 300);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('reports remaining counts accurately', () => {
    const check = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(check('ip', 0).remaining).toBe(1);
    expect(check('ip', 1).remaining).toBe(0);
  });

  it('resets after the window elapses', () => {
    const check = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(check('ip', 0).allowed).toBe(true);
    expect(check('ip', 500).allowed).toBe(false);
    expect(check('ip', 1000).allowed).toBe(true); // new window
  });

  it('tracks keys independently', () => {
    const check = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(check('a', 0).allowed).toBe(true);
    expect(check('b', 0).allowed).toBe(true);
    expect(check('a', 1).allowed).toBe(false);
  });
});
