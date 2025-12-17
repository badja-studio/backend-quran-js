const redisManager = require('../../config/redis');
const config = require('../../config/config');
const { generateCacheKey } = require('../utils/cache-key-generator');

/**
 * Cache exclusions - endpoints that should NEVER be cached
 */
const CACHE_EXCLUSIONS = [
  '/api/participants/not-assessed',
  '/api/participants/ready-to-assess'
];

/**
 * Check if request should be cached
 * @param {Object} req - Express request
 * @returns {boolean} Whether to cache this request
 */
function shouldCache(req) {
  // Rule 1: ONLY GET requests
  if (req.method !== 'GET') {
    return false;
  }

  // Rule 2: Exclusion list for specific paths
  if (CACHE_EXCLUSIONS.includes(req.path)) {
    return false;
  }

  // Rule 3: Don't cache if query has status=BELUM
  if (req.query.status === 'BELUM') {
    return false;
  }

  return true;
}

/**
 * Cache middleware factory
 * @param {Object} options - Cache options
 * @param {number} options.ttl - Time to live in seconds (optional, uses default if not provided)
 * @param {boolean} options.userSpecific - Include user ID in cache key (default: false)
 * @returns {Function} Express middleware
 */
function cacheMiddleware(options = {}) {
  return async (req, res, next) => {
    // Check if caching is enabled
    if (!config.cache.enabled) {
      return next();
    }

    // Check if this request should be cached
    if (!shouldCache(req)) {
      return next();
    }

    // Check if Redis is connected
    if (!redisManager.isConnected) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Cache] Redis not connected, bypassing cache');
      }
      return next();
    }

    try {
      const redis = redisManager.getCacheClient();
      if (!redis) {
        return next();
      }

      // Generate cache key
      const cacheKey = generateCacheKey(req, {
        userSpecific: options.userSpecific || false
      });

      // Try to get from cache
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        // Cache hit
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Cache HIT] ${req.method} ${req.path}`);
        }

        // Parse cached data
        const data = JSON.parse(cachedData);

        // Set cache header
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-Key', cacheKey);

        // Return cached response
        return res.json(data);
      }

      // Cache miss - intercept response
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Cache MISS] ${req.method} ${req.path}`);
      }

      // Store original res.json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = function (data) {
        // Determine TTL
        const ttl = options.ttl || config.cache.defaultTTL;

        // Cache the response (async, don't wait)
        redis.setex(cacheKey, ttl, JSON.stringify(data)).catch(error => {
          console.error(`[Cache] Error caching response for ${cacheKey}:`, error.message);
        });

        if (process.env.NODE_ENV === 'development') {
          console.log(`[Cache SET] ${cacheKey} (TTL: ${ttl}s)`);
        }

        // Set cache header
        res.setHeader('X-Cache', 'MISS');
        res.setHeader('X-Cache-Key', cacheKey);

        // Call original json function
        return originalJson(data);
      };

      next();

    } catch (error) {
      console.error('[Cache] Middleware error:', error.message);
      // On error, bypass cache and continue
      return next();
    }
  };
}

/**
 * No-cache middleware - explicitly disable caching for specific routes
 * @returns {Function} Express middleware
 */
function noCache() {
  return (req, res, next) => {
    res.setHeader('X-Cache', 'DISABLED');
    next();
  };
}

module.exports = {
  cacheMiddleware,
  noCache
};