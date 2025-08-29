/**
 * Rate limiting middleware for anonymous submissions
 */

// Simple in-memory rate limiting store
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

function createRateLimiter(maxRequests: number, windowMs: number) {
  return (key: string): { allowed: boolean; retryAfter?: number } => {
    const now = Date.now();
    const entry = rateLimitStore.get(key);
    
    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return { allowed: true };
    }
    
    if (entry.count >= maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      };
    }
    
    // Increment counter
    entry.count += 1;
    return { allowed: true };
  };
}

export default () => {
  return async (ctx, next) => {
    // Apply rate limiting only to POST endpoints
    if (ctx.request.method === 'POST') {
      const endpoint = ctx.request.path;
      const ip = ctx.request.ip || ctx.request.header['x-forwarded-for'] || 'unknown';
      
      let rateLimiter;
      let limitType = '';
      
      if (endpoint.includes('/submissions')) {
        // 5 submissions per hour per IP
        rateLimiter = createRateLimiter(5, 60 * 60 * 1000); // 1 hour
        limitType = 'submission';
      } else if (endpoint.includes('/ideas')) {
        // 10 ideas per hour per IP
        rateLimiter = createRateLimiter(10, 60 * 60 * 1000); // 1 hour
        limitType = 'idea';
      }
      
      if (rateLimiter && limitType) {
        const key = `${limitType}:${ip}`;
        const { allowed, retryAfter } = rateLimiter(key);
        
        if (!allowed) {
          ctx.status = 429;
          ctx.set('Retry-After', retryAfter?.toString() || '3600');
          ctx.body = {
            error: {
              status: 429,
              name: 'RateLimitError',
              message: `Too many ${limitType}s. Please try again later.`,
              details: {
                retryAfter: retryAfter,
              },
            },
          };
          return;
        }
      }
    }
    
    await next();
  };
};
