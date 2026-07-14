const rateLimit = new Map();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // max requests per window per IP
const AUTH_MAX_REQUESTS = 20; // stricter limit for auth routes

/**
 * Clean up expired entries from the rate limit map
 */
const cleanup = () => {
  const now = Date.now();
  for (const [key, entry] of rateLimit.entries()) {
    if (now - entry.startTime > WINDOW_MS) {
      rateLimit.delete(key);
    }
  }
};

// Run cleanup every 5 minutes to prevent memory leaks
setInterval(cleanup, 5 * 60 * 1000);

/**
 * Creates a rate limiting middleware
 * @param {Object} options - Configuration options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum number of requests per window
 * @param {string} options.message - Error message when limit is exceeded
 */
const createRateLimiter = (options = {}) => {
  const {
    windowMs = WINDOW_MS,
    max = MAX_REQUESTS,
    message = "Too many requests, please try again later.",
  } = options;

  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress || "unknown";
    const key = `${clientIP}:${req.baseUrl || req.path}`;
    const now = Date.now();

    const entry = rateLimit.get(key);

    if (!entry || now - entry.startTime > windowMs) {
      // New window
      rateLimit.set(key, { count: 1, startTime: now });
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", max - 1);
      return next();
    }

    entry.count++;

    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.startTime + windowMs - now) / 1000);
      res.setHeader("Retry-After", retryAfter);
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", 0);
      return res.status(429).json({
        success: false,
        message,
        retryAfter,
      });
    }

    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", max - entry.count);
    next();
  };
};

// General API rate limiter
const apiLimiter = createRateLimiter({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  message: "Too many requests from this IP, please try again after 15 minutes.",
});

// Stricter limiter for authentication routes (login, signup, OTP)
const authLimiter = createRateLimiter({
  windowMs: WINDOW_MS,
  max: AUTH_MAX_REQUESTS,
  message: "Too many authentication attempts, please try again after 15 minutes.",
});

module.exports = { apiLimiter, authLimiter, createRateLimiter };
