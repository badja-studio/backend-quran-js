const redisManager = require('../../config/redis');
const config = require('../../config/config');

/**
 * Get value from cache
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} Cached value or null
 */
async function getCache(key) {
  try {
    if (!config.cache.enabled || !redisManager.isConnected) {
      return null;
    }

    const redis = redisManager.getCacheClient();
    if (!redis) {
      return null;
    }

    const value = await redis.get(key);

    if (!value) {
      return null;
    }

    // Try to parse JSON
    try {
      return JSON.parse(value);
    } catch (e) {
      // Return as string if not JSON
      return value;
    }
  } catch (error) {
    console.error(`[Cache] Error getting key "${key}":`, error.message);
    return null;
  }
}

/**
 * Set value in cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<boolean>} Success status
 */
async function setCache(key, value, ttl) {
  try {
    if (!config.cache.enabled || !redisManager.isConnected) {
      return false;
    }

    const redis = redisManager.getCacheClient();
    if (!redis) {
      return false;
    }

    // Convert value to string (JSON if object)
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

    // Set with TTL
    await redis.setex(key, ttl, stringValue);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache SET] ${key} (TTL: ${ttl}s)`);
    }

    return true;
  } catch (error) {
    console.error(`[Cache] Error setting key "${key}":`, error.message);
    return false;
  }
}

/**
 * Delete value from cache
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} Success status
 */
async function deleteCache(key) {
  try {
    if (!config.cache.enabled || !redisManager.isConnected) {
      return false;
    }

    const redis = redisManager.getCacheClient();
    if (!redis) {
      return false;
    }

    await redis.del(key);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache DEL] ${key}`);
    }

    return true;
  } catch (error) {
    console.error(`[Cache] Error deleting key "${key}":`, error.message);
    return false;
  }
}

/**
 * Delete multiple keys matching a pattern
 * @param {string} pattern - Key pattern (e.g., "quran:dashboard:*")
 * @returns {Promise<number>} Number of keys deleted
 */
async function deletePattern(pattern) {
  try {
    if (!config.cache.enabled || !redisManager.isConnected) {
      return 0;
    }

    const redis = redisManager.getCacheClient();
    if (!redis) {
      return 0;
    }

    // Find keys matching pattern
    const keys = await redis.keys(pattern);

    if (keys.length === 0) {
      return 0;
    }

    // Delete all matching keys
    await redis.del(...keys);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache DEL] ${keys.length} keys matching "${pattern}"`);
    }

    return keys.length;
  } catch (error) {
    console.error(`[Cache] Error deleting pattern "${pattern}":`, error.message);
    return 0;
  }
}

/**
 * Check if key exists in cache
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} Whether key exists
 */
async function existsCache(key) {
  try {
    if (!config.cache.enabled || !redisManager.isConnected) {
      return false;
    }

    const redis = redisManager.getCacheClient();
    if (!redis) {
      return false;
    }

    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    console.error(`[Cache] Error checking key "${key}":`, error.message);
    return false;
  }
}

/**
 * Get TTL of a key
 * @param {string} key - Cache key
 * @returns {Promise<number>} TTL in seconds, or -1 if no expiry, -2 if key doesn't exist
 */
async function getTTL(key) {
  try {
    if (!config.cache.enabled || !redisManager.isConnected) {
      return -2;
    }

    const redis = redisManager.getCacheClient();
    if (!redis) {
      return -2;
    }

    return await redis.ttl(key);
  } catch (error) {
    console.error(`[Cache] Error getting TTL for "${key}":`, error.message);
    return -2;
  }
}

/**
 * Increment a counter in cache
 * @param {string} key - Cache key
 * @param {number} amount - Amount to increment (default: 1)
 * @returns {Promise<number|null>} New value or null on error
 */
async function incrementCache(key, amount = 1) {
  try {
    if (!config.cache.enabled || !redisManager.isConnected) {
      return null;
    }

    const redis = redisManager.getCacheClient();
    if (!redis) {
      return null;
    }

    return await redis.incrby(key, amount);
  } catch (error) {
    console.error(`[Cache] Error incrementing key "${key}":`, error.message);
    return null;
  }
}

/**
 * Get cache statistics
 * @returns {Promise<Object>} Cache statistics
 */
async function getCacheStats() {
  try {
    if (!config.cache.enabled || !redisManager.isConnected) {
      return { enabled: false, connected: false };
    }

    const redis = redisManager.getCacheClient();
    if (!redis) {
      return { enabled: true, connected: false };
    }

    const info = await redis.info('stats');
    const keyspace = await redis.info('keyspace');

    return {
      enabled: true,
      connected: true,
      info,
      keyspace
    };
  } catch (error) {
    console.error('[Cache] Error getting stats:', error.message);
    return { enabled: true, connected: false, error: error.message };
  }
}

module.exports = {
  getCache,
  setCache,
  deleteCache,
  deletePattern,
  existsCache,
  getTTL,
  incrementCache,
  getCacheStats
};
