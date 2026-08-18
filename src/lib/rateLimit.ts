export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

/**
 * Client-side rate limiter using localStorage to persist across reloads.
 * Returns true if the action is allowed, false if rate limited.
 */
export const checkRateLimit = (actionId: string, config: RateLimitConfig): boolean => {
  const now = Date.now();
  const storageKey = `rate_limit_${actionId}`;
  
  let records: number[] = [];
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      records = JSON.parse(stored);
    }
  } catch (e) {
    // Ignore parse errors
  }
  
  // Filter out records outside the time window
  const validRecords = records.filter(ts => now - ts < config.windowMs);
  
  if (validRecords.length >= config.maxRequests) {
    // Update local storage with cleaned up valid records
    localStorage.setItem(storageKey, JSON.stringify(validRecords));
    return false;
  }
  
  validRecords.push(now);
  localStorage.setItem(storageKey, JSON.stringify(validRecords));
  return true;
};
