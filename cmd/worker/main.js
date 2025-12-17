const { Worker } = require('bullmq');
const { connectDB } = require('../../config/database');
const redisManager = require('../../config/redis');
const config = require('../../config/config');
const dashboardQueue = require('../../internal/queues/dashboard.queue');
const exportQueue = require('../../internal/queues/export.queue');
const { processDashboardRefresh } = require('../../internal/workers/processors/dashboard.processor');
const { processExportJob } = require('../../internal/workers/processors/export.processor');

/**
 * Workers
 */
let dashboardWorker = null;
let exportWorker = null;

/**
 * Initialize and start the worker
 */
async function startWorker() {
  try {
    console.log('=================================');
    console.log('🔧 Starting Quran Worker');
    console.log('=================================');

    // Connect to database
    console.log('[Worker] Connecting to database...');
    await connectDB();

    // Initialize Redis connections
    console.log('[Worker] Initializing Redis connections...');
    await redisManager.initCacheClient();
    await redisManager.initQueueClient();

    const queueConnection = redisManager.getQueueClient();

    if (!queueConnection) {
      throw new Error('Redis queue client not available');
    }

    // Initialize queues
    console.log('[Worker] Initializing dashboard queue...');
    await dashboardQueue.initialize();

    console.log('[Worker] Initializing export queue...');
    await exportQueue.initialize();

    // Schedule dashboard refresh (every 2 hours)
    console.log('[Worker] Scheduling dashboard refresh...');
    await dashboardQueue.scheduleDashboardRefresh();

    // Trigger immediate refresh on startup
    console.log('[Worker] Triggering immediate dashboard refresh...');
    await dashboardQueue.triggerImmediateRefresh();

    // Create dashboard worker
    console.log('[Worker] Creating dashboard worker...');
    dashboardWorker = new Worker(
      'dashboard-refresh',
      async (job) => {
        return await processDashboardRefresh(job);
      },
      {
        connection: queueConnection,
        concurrency: 1, // Only one dashboard refresh at a time
        limiter: {
          max: 1,
          duration: 60000 // Max 1 job per minute
        }
      }
    );

    // Create export worker
    const exportConcurrency = config.worker.exportConcurrency || 2;
    console.log(`[Worker] Creating export worker (concurrency: ${exportConcurrency})...`);

    exportWorker = new Worker(
      'export-jobs',
      async (job) => {
        return await processExportJob(job);
      },
      {
        connection: queueConnection,
        concurrency: exportConcurrency, // Process multiple exports concurrently
        limiter: {
          max: 5,
          duration: 60000 // Max 5 export jobs per minute
        }
      }
    );

    // Dashboard worker event handlers
    dashboardWorker.on('completed', (job, result) => {
      console.log(`[Dashboard Worker] Job ${job.id} completed:`, result);
    });

    dashboardWorker.on('failed', (job, error) => {
      console.error(`[Dashboard Worker] Job ${job?.id} failed:`, error.message);
    });

    dashboardWorker.on('error', (error) => {
      console.error('[Dashboard Worker] Worker error:', error.message);
    });

    // Export worker event handlers
    exportWorker.on('completed', (job, result) => {
      console.log(`[Export Worker] Job ${job.id} completed:`, result);
    });

    exportWorker.on('failed', (job, error) => {
      console.error(`[Export Worker] Job ${job?.id} failed:`, error.message);
    });

    exportWorker.on('error', (error) => {
      console.error('[Export Worker] Worker error:', error.message);
    });

    exportWorker.on('progress', (job, progress) => {
      console.log(`[Export Worker] Job ${job.id} progress: ${progress}%`);
    });

    console.log('=================================');
    console.log('✅ Worker started successfully');
    console.log('📊 Dashboard refresh scheduled (every 2 hours)');
    console.log(`📥 Export worker ready (concurrency: ${exportConcurrency})`);
    console.log('=================================');

  } catch (error) {
    console.error('❌ Failed to start worker:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
async function shutdown() {
  console.log('[Worker] Shutting down gracefully...');

  try {
    // Close workers
    if (dashboardWorker) {
      await dashboardWorker.close();
      console.log('[Worker] Dashboard worker closed');
    }

    if (exportWorker) {
      await exportWorker.close();
      console.log('[Worker] Export worker closed');
    }

    // Close queues
    await dashboardQueue.close();
    await exportQueue.close();

    // Shutdown Redis
    await redisManager.shutdown();

    console.log('[Worker] Shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('[Worker] Error during shutdown:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('[Worker] Uncaught exception:', error);
  shutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Worker] Unhandled rejection at:', promise, 'reason:', reason);
  shutdown();
});

// Start the worker
startWorker();

module.exports = { dashboardWorker };
