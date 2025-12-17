require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'quran_db',
    user: process.env.DB_USER || 'quran_user',
    password: process.env.DB_PASSWORD || 'quran_password',
    dialect: 'postgres',
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 30,        // Increased for 200K+ scale
      min: parseInt(process.env.DB_POOL_MIN) || 5,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 60000,  // 60s timeout
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000,
      evict: parseInt(process.env.DB_POOL_EVICT) || 1000   // Check for idle connections every 1s
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  },
  api: {
    title: process.env.API_TITLE || 'Quran API',
    version: process.env.API_VERSION || '1.0.0',
    description: process.env.API_DESCRIPTION || 'API for Quran management system'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30m'
  },
  cors: {
    // Parse allowed origins from environment variable (comma-separated)
    // Example: CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
    allowedOrigins: process.env.CORS_ALLOWED_ORIGINS
      ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : ['*'] // Default to allow all
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
    maxRetries: parseInt(process.env.REDIS_MAX_RETRIES, 10) || 10,
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY, 10) || 3000,
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT, 10) || 10000
  },
  cache: {
    enabled: process.env.CACHE_ENABLED === 'true',
    defaultTTL: parseInt(process.env.CACHE_DEFAULT_TTL, 10) || 60,
    masterDataTTL: parseInt(process.env.CACHE_MASTER_DATA_TTL, 10) || 300,
    dashboardTTL: parseInt(process.env.CACHE_DASHBOARD_TTL, 10) || 7200
  },
  worker: {
    dashboardRefreshCron: process.env.WORKER_DASHBOARD_REFRESH_CRON || '0 */2 * * *',
    exportConcurrency: parseInt(process.env.WORKER_EXPORT_CONCURRENCY, 10) || 2,
    exportTimeout: parseInt(process.env.WORKER_EXPORT_TIMEOUT, 10) || 300000
  }
};
