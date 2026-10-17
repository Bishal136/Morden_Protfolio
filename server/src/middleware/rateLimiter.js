const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for Auth endpoints (Login & Refresh)
 * Prevents brute-force and credential stuffing attacks
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

/**
 * Rate limiter for Public Comment submission
 * Prevents comment spam
 */
const commentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // Limit each IP to 15 comments per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many comments submitted from this IP. Please try again after an hour.',
  },
});

/**
 * Rate limiter for Public Contact Message submission
 * Prevents inbox and database spam
 */
const messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 direct messages per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many messages sent from this IP. Please try again after an hour.',
  },
});

module.exports = {
  authLimiter,
  commentLimiter,
  messageLimiter,
};
