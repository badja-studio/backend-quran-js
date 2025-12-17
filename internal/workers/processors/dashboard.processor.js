const redisManager = require('../../../config/redis');
const config = require('../../../config/config');
const dashboardUseCase = require('../../usecase/dashboard.usecase');

/**
 * Process dashboard refresh job
 * Fetches all dashboard data and caches it in Redis
 * @param {Object} job - BullMQ job object
 */
async function processDashboardRefresh(job) {
  const startTime = Date.now();
  console.log(`[Dashboard Worker] Starting dashboard refresh (Job ID: ${job.id})`);

  try {
    const redis = redisManager.getCacheClient();

    if (!redis || !redisManager.isConnected) {
      throw new Error('Redis cache client not available');
    }

    const TTL = config.cache.dashboardTTL; // 2 hours (7200 seconds)

    // Update job progress
    await job.updateProgress(10);

    console.log('[Dashboard Worker] Fetching all dashboard data...');

    // Fetch all 7 dashboard queries in parallel
    const [
      overview,
      statistics,
      participation,
      demographics,
      performance,
      errors,
      provinces
    ] = await Promise.all([
      dashboardUseCase.getDashboardOverview(),
      dashboardUseCase.getBasicStatistics(),
      dashboardUseCase.getParticipationStats(),
      dashboardUseCase.getDemographicData(),
      dashboardUseCase.getPerformanceAnalytics(),
      dashboardUseCase.getErrorAnalysis(),
      dashboardUseCase.getProvinceData()
    ]);

    await job.updateProgress(60);

    console.log('[Dashboard Worker] All data fetched, caching to Redis...');

    // Cache all results atomically using pipeline
    const pipeline = redis.pipeline();

    pipeline.setex('quran:dashboard:overview:v1', TTL, JSON.stringify(overview));
    pipeline.setex('quran:dashboard:statistics:v1', TTL, JSON.stringify(statistics));
    pipeline.setex('quran:dashboard:participation:v1', TTL, JSON.stringify(participation));
    pipeline.setex('quran:dashboard:demographics:v1', TTL, JSON.stringify(demographics));
    pipeline.setex('quran:dashboard:performance:v1', TTL, JSON.stringify(performance));
    pipeline.setex('quran:dashboard:errors:v1', TTL, JSON.stringify(errors));
    pipeline.setex('quran:dashboard:provinces:v1', TTL, JSON.stringify(provinces));

    await pipeline.exec();

    await job.updateProgress(100);

    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();

    console.log(`[Dashboard Worker] Dashboard cache refreshed successfully in ${duration}ms at ${timestamp}`);

    return {
      success: true,
      timestamp,
      duration,
      cached: 7,
      ttl: TTL
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Dashboard Worker] Dashboard refresh failed after ${duration}ms:`, error.message);
    console.error(error.stack);

    // BullMQ will retry based on job configuration
    throw error;
  }
}

module.exports = {
  processDashboardRefresh
};
