// RATE LIMITER DISABLED - For testing/development purposes
// To re-enable, uncomment the code below and comment out the no-op functions

// const rateLimit = require('express-rate-limit');

// No-op middleware that does nothing (rate limiting disabled)
const noOpLimiter = (_req, _res, next) => next();

// General rate limiter untuk semua request - DISABLED
const generalLimiter = noOpLimiter;

// Rate limiter khusus untuk auth endpoints (lebih ketat) - DISABLED
const authLimiter = noOpLimiter;

// Rate limiter untuk API endpoints (moderate) - DISABLED
const apiLimiter = noOpLimiter;

// Rate limiter untuk master data (lebih longgar karena sering diakses frontend) - DISABLED
const masterDataLimiter = noOpLimiter;

/*
// === ORIGINAL RATE LIMITER CODE (COMMENTED OUT) ===
// Uncomment this section to re-enable rate limiting

const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.path === '/api/health';
  }
});

const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 10,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS) || 200,
  message: {
    success: false,
    message: 'Too many API requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.API_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const masterDataLimiter = rateLimit({
  windowMs: parseInt(process.env.MASTER_DATA_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.MASTER_DATA_RATE_LIMIT_MAX_REQUESTS) || 500,
  message: {
    success: false,
    message: 'Too many master data requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.MASTER_DATA_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});
*/

module.exports = {
  generalLimiter,
  authLimiter,
  apiLimiter,
  masterDataLimiter
};
