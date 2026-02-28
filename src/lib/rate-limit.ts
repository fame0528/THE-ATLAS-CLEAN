/**
 * Simple in-memory rate limiter
 *
 * Uses sliding window algorithm:
 * - For each token, track timestamps of requests
 * - On each request, prune old entries (> 1 minute)
 * - Allow if count < max per minute
 *
 * WARNING: This is in-memory only. Restarting server clears state.
 * For production multi-instance, use Redis or similar.
 */

type Window = Map<string, number[]>;

const window = new Map<string, number[]>();
const CLEANUP_INTERVAL_MS = 60 * 1000; // 1 minute

/**
 * Check if a request from given token key is within rate limit
 *
 * @param key - Unique identifier (token prefix or IP)
 * @param maxPerMinute - Maximum allowed requests per minute (default 10)
 * @returns true if allowed, false if rate limited
 */
export function checkRateLimit(key: string, maxPerMinute = 10): boolean {
  const now = Date.now();
  const minute = 60 * 1000;
  const windowForKey = window.get(key) || [];

  // Clean old entries (older than 1 minute)
  const recent = windowForKey.filter(t => now - t < minute);

  if (recent.length >= maxPerMinute) {
    return false;
  }

  // Record this request
  recent.push(now);
  window.set(key, recent);
  return true;
}

/**
 * Get current request count for a token (for debugging/monitoring)
 *
 * @param key - Token prefix
 * @returns Number of requests in the last minute
 */
export function getRequestCount(key: string): number {
  const windowForKey = window.get(key) || [];
  const now = Date.now();
  const minute = 60 * 1000;
  return windowForKey.filter(t => now - t < minute).length;
}

/**
 * Clear rate limit state for a token (admin function)
 *
 * @param key - Token to clear (or omit to clear all)
 */
export function clearRateLimit(key?: string) {
  if (key) {
    window.delete(key);
  } else {
    window.clear();
  }
}

// Optional: Periodic cleanup to prevent memory growth
// Not strictly needed since we prune on each access, but can run as safety
if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const minute = 60 * 1000;
    for (const [key, timestamps] of window.entries()) {
      const recent = timestamps.filter(t => now - t < minute);
      if (recent.length === 0) {
        window.delete(key);
      } else {
        window.set(key, recent);
      }
    }
  }, CLEANUP_INTERVAL_MS);
}
