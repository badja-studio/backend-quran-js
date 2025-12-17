const Redis = require('ioredis');
const config = require('./config');

class RedisManager {
  constructor() {
    this.cacheClient = null;
    this.queueClient = null;
    this.isConnected = false;
  }

  /**
   * Initialize Redis cache client
   */
  async initCacheClient() {
    try {
      const redisConfig = {
        host: config.redis.host,
        port: config.redis.port,
        db: config.redis.db,
        maxRetriesPerRequest: config.redis.maxRetries,
        retryStrategy: (times) => {
          if (times > config.redis.maxRetries) {
            console.error('[Redis Cache] Max retries reached, giving up');
            return null;
          }
          const delay = Math.min(times * config.redis.retryDelay, 10000);
          console.log(`[Redis Cache] Retry attempt ${times}, waiting ${delay}ms`);
          return delay;
        },
        connectTimeout: config.redis.connectTimeout,
        enableOfflineQueue: true,
        lazyConnect: false
      };

      // Add password if provided
      if (config.redis.password) {
        redisConfig.password = config.redis.password;
      }

      this.cacheClient = new Redis(redisConfig);

      // Event handlers
      this.cacheClient.on('connect', () => {
        console.log('[Redis Cache] Connected to Redis');
        this.isConnected = true;
      });

      this.cacheClient.on('ready', () => {
        console.log('[Redis Cache] Redis is ready');
      });

      this.cacheClient.on('error', (error) => {
        console.error('[Redis Cache] Redis error:', error.message);
        this.isConnected = false;
      });

      this.cacheClient.on('close', () => {
        console.warn('[Redis Cache] Connection closed');
        this.isConnected = false;
      });

      this.cacheClient.on('reconnecting', () => {
        console.log('[Redis Cache] Reconnecting...');
      });

      // Test connection
      await this.cacheClient.ping();
      console.log('[Redis Cache] Connection established successfully');

      return this.cacheClient;

    } catch (error) {
      console.error('[Redis Cache] Failed to initialize:', error.message);
      this.isConnected = false;
      // Don't throw error - allow app to continue without cache
      return null;
    }
  }

  /**
   * Initialize Redis queue client for BullMQ
   */
  async initQueueClient() {
    try {
      const redisConfig = {
        host: config.redis.host,
        port: config.redis.port,
        db: config.redis.db,
        maxRetriesPerRequest: null, // BullMQ requires null for infinite retries
        retryStrategy: (times) => {
          const delay = Math.min(times * config.redis.retryDelay, 10000);
          console.log(`[Redis Queue] Retry attempt ${times}, waiting ${delay}ms`);
          return delay;
        },
        connectTimeout: config.redis.connectTimeout,
        enableOfflineQueue: true,
        lazyConnect: false
      };

      // Add password if provided
      if (config.redis.password) {
        redisConfig.password = config.redis.password;
      }

      this.queueClient = new Redis(redisConfig);

      // Event handlers
      this.queueClient.on('connect', () => {
        console.log('[Redis Queue] Connected to Redis');
      });

      this.queueClient.on('ready', () => {
        console.log('[Redis Queue] Redis is ready');
      });

      this.queueClient.on('error', (error) => {
        console.error('[Redis Queue] Redis error:', error.message);
      });

      this.queueClient.on('close', () => {
        console.warn('[Redis Queue] Connection closed');
      });

      this.queueClient.on('reconnecting', () => {
        console.log('[Redis Queue] Reconnecting...');
      });

      // Test connection
      await this.queueClient.ping();
      console.log('[Redis Queue] Connection established successfully');

      return this.queueClient;

    } catch (error) {
      console.error('[Redis Queue] Failed to initialize:', error.message);
      // Don't throw error - allow app to continue
      return null;
    }
  }

  /**
   * Get cache client instance
   */
  getCacheClient() {
    return this.cacheClient;
  }

  /**
   * Get queue client instance
   */
  getQueueClient() {
    return this.queueClient;
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      if (!this.cacheClient) {
        return { status: 'disconnected', message: 'Cache client not initialized' };
      }

      const result = await this.cacheClient.ping();

      if (result === 'PONG') {
        return { status: 'healthy', message: 'Redis is responding' };
      } else {
        return { status: 'unhealthy', message: 'Unexpected ping response' };
      }
    } catch (error) {
      return { status: 'unhealthy', message: error.message };
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    try {
      console.log('[Redis] Shutting down Redis connections...');

      if (this.cacheClient) {
        await this.cacheClient.quit();
        console.log('[Redis Cache] Connection closed');
      }

      if (this.queueClient) {
        await this.queueClient.quit();
        console.log('[Redis Queue] Connection closed');
      }

      this.isConnected = false;
      console.log('[Redis] All connections closed successfully');
    } catch (error) {
      console.error('[Redis] Error during shutdown:', error.message);
      // Force disconnect if graceful shutdown fails
      if (this.cacheClient) {
        this.cacheClient.disconnect();
      }
      if (this.queueClient) {
        this.queueClient.disconnect();
      }
    }
  }
}

// Export singleton instance
module.exports = new RedisManager();
