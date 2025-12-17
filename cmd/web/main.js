const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('../../config/config');
const { connectDB } = require('../../config/database');
const redisManager = require('../../config/redis');
const setupSwagger = require('../../config/swagger');
const routes = require('../../internal/routes');
const { generalLimiter } = require('../../internal/middleware/rateLimiter.middleware');

const app = express();

// Trust proxy - Enable if behind reverse proxy (nginx, load balancer, etc.)
// This allows Express to correctly identify client IP from X-Forwarded-For header
app.set('trust proxy', true);

// Middleware
app.use(helmet());

// Rate limiting middleware - Apply to all requests
app.use(generalLimiter);

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow all origins if '*' is in the allowed origins
    if (config.cors.allowedOrigins.includes('*')) {
      callback(null, true);
    } 
    // Allow if origin is in the allowed list
    else if (config.cors.allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } 
    // Reject if origin is not allowed
    else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Quran API',
    version: config.api.version,
    documentation: '/api-docs'
  });
});

// Setup Swagger documentation
setupSwagger(app);

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(config.env === 'development' && { stack: err.stack })
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Initialize Redis connections
    console.log('[Redis] Initializing Redis connections...');
    await redisManager.initCacheClient();
    await redisManager.initQueueClient();

    // Trigger dashboard cache warm-up (if enabled)
    if (process.env.WARM_CACHE_ON_STARTUP === 'true' && redisManager.isConnected) {
      console.log('[Cache] Dashboard warm-up will be handled by worker');
      // Note: Dashboard warm-up is triggered by the worker on startup
      // Main app just ensures Redis is connected
    }

    // Start listening
    app.listen(config.port, () => {
      console.log('=================================');
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📝 Environment: ${config.env}`);
      console.log(`💾 Redis cache: ${redisManager.isConnected ? 'Connected' : 'Disabled'}`);
      console.log(`📚 API Docs: http://localhost:${config.port}/api-docs`);
      console.log(`🏥 Health check: http://localhost:${config.port}/api/health`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await redisManager.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await redisManager.shutdown();
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
