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
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
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
  }
};
