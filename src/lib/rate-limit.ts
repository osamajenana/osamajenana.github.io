/**
 * In-memory sliding-window rate limiter.
 *
 * Deliberately not Redis: this guards one contact form on a single-process
 * deployment. `ecosystem.config.cjs` pins PM2 to fork mode with one instance
 * precisely so this counter is authoritative — if that ever becomes a cluster,
 * this must move to a shared store or it silently multiplies the allowance.
 */

type Window = { hits: number[] };

const buckets = new Map<string, Window>();

/** Drop buckets whose newest hit is older than the window, so this cannot grow unbounded. */
function sweep(windowMs: number, now: number) {
  for (const [key, bucket] of buckets) {
    const newest = bucket.hits.at(-1);
    if (newest === undefined || now - newest > windowMs) buckets.delete(key);
  }
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { ok: boolean; retryAfterMs: number } {
  const now = Date.now();

  // Cheap amortised cleanup — roughly one sweep per 50 calls.
  if (buckets.size > 0 && Math.floor(now / 1000) % 50 === 0) sweep(windowMs, now);

  const bucket = buckets.get(key) ?? { hits: [] };
  const fresh = bucket.hits.filter((at) => now - at < windowMs);

  if (fresh.length >= limit) {
    const oldest = fresh[0] ?? now;
    buckets.set(key, { hits: fresh });
    return { ok: false, retryAfterMs: windowMs - (now - oldest) };
  }

  fresh.push(now);
  buckets.set(key, { hits: fresh });
  return { ok: true, retryAfterMs: 0 };
}

/**
 * Client IP behind nginx. `x-forwarded-for` is a comma-separated chain; the
 * left-most entry is the original client. Falls back to a constant so a missing
 * header degrades to a shared global limit rather than to no limit at all.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return headers.get('x-real-ip')?.trim() || 'unknown';
}
