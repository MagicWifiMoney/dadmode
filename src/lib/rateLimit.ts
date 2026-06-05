export interface RateLimitResult {
  allowed: boolean;
  /** Requests remaining in the current window. */
  remaining: number;
  /** Epoch ms when the current window resets. */
  resetAt: number;
}

export interface RateLimiterOptions {
  /** Max requests allowed per key per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

/**
 * A tiny fixed-window rate limiter backed by an in-process Map.
 *
 * Note: this is best-effort and per-instance. In a multi-instance / serverless
 * deployment it limits per warm instance, not globally — for hard guarantees
 * back it with a shared store (e.g. Upstash/Redis). It still meaningfully
 * blunts naive bursts and accidental double-submits.
 */
export function createRateLimiter({ limit, windowMs }: RateLimiterOptions) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return function check(key: string, now: number = Date.now()): RateLimitResult {
    const existing = hits.get(key);

    if (!existing || now >= existing.resetAt) {
      const resetAt = now + windowMs;
      hits.set(key, { count: 1, resetAt });

      // Opportunistically prune expired entries so the map can't grow forever.
      if (hits.size > 10_000) {
        for (const [k, v] of hits) {
          if (now >= v.resetAt) hits.delete(k);
        }
      }

      return { allowed: true, remaining: limit - 1, resetAt };
    }

    if (existing.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: existing.resetAt };
    }

    existing.count += 1;
    return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
  };
}
