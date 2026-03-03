import "server-only";

type RateLimitEntry = {
  count: number;
  windowStart: number;
};

const stores = new Map<string, Map<string, RateLimitEntry>>();

export function createInMemoryRateLimiter(key: string, windowMs: number, maxRequests: number) {
  if (!stores.has(key)) {
    stores.set(key, new Map<string, RateLimitEntry>());
  }

  const store = stores.get(key)!;

  return {
    check(identifier: string) {
      const now = Date.now();
      const existing = store.get(identifier);

      if (!existing || now - existing.windowStart > windowMs) {
        store.set(identifier, { count: 1, windowStart: now });
        return { allowed: true, remaining: maxRequests - 1, limit: maxRequests, windowMs };
      }

      if (existing.count >= maxRequests) {
        return { allowed: false, remaining: 0, limit: maxRequests, windowMs };
      }

      existing.count += 1;
      store.set(identifier, existing);

      return { allowed: true, remaining: maxRequests - existing.count, limit: maxRequests, windowMs };
    },
  };
}

const contactLimiter = createInMemoryRateLimiter("contact", 10 * 60 * 1000, 5);

export function checkRateLimit(ip: string) {
  return contactLimiter.check(ip);
}

export const rateLimitConfig = {
  windowMs: 10 * 60 * 1000,
  maxRequests: 5,
};
