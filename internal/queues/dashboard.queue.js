const { Queue } = require('bullmq');
const redisManager = require('../../config/redis');
const config = require('../../config/config');

/**
 * Dashboard refresh queue
 * Refreshes dashboard cache every 2 hours
 */
class DashboardQueue {
  constructor() {
    this.queue = null;
  }

  /**
   * Initialize the dashboard queue
   */
  async initialize() {
    try {
      const connection = redisManager.getQueueClient();

      if (!connection) {
        console.error('[Dashboard Queue] Redis queue client not available');
        return null;
      }

      this.queue = new Queue('dashboard-refresh', {
        connection,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000
          },
          removeOnComplete: {
            count: 10 // Keep last 10 completed jobs
          },
          removeOnFail: {
            count: 20 // Keep last 20 failed jobs for debugging
          }
        }
      });

      console.log('[Dashboard Queue] Queue initialized successfully');
      return this.queue;

    } catch (error) {
      console.error('[Dashboard Queue] Failed to initialize:', error.message);
      return null;
    }
  }

  /**
   * Schedule dashboard refresh job (every 2 hours)
   */
  async scheduleDashboardRefresh() {
    if (!this.queue) {
      console.error('[Dashboard Queue] Queue not initialized');
      return null;
    }

    try {
      // Remove existing repeatable jobs first
      const repeatableJobs = await this.queue.getRepeatableJobs();
      for (const job of repeatableJobs) {
        await this.queue.removeRepeatableByKey(job.key);
      }

      // Add new repeatable job
      const job = await this.queue.add(
        'refresh-all',
        {},
        {
          repeat: {
            pattern: config.worker.dashboardRefreshCron
          },
          jobId: 'dashboard-refresh-recurring'
        }
      );

      console.log(`[Dashboard Queue] Scheduled dashboard refresh with cron: ${config.worker.dashboardRefreshCron}`);
      return job;

    } catch (error) {
      console.error('[Dashboard Queue] Failed to schedule refresh:', error.message);
      return null;
    }
  }

  /**
   * Trigger immediate dashboard refresh (one-time)
   */
  async triggerImmediateRefresh() {
    if (!this.queue) {
      console.error('[Dashboard Queue] Queue not initialized');
      return null;
    }

    try {
      const job = await this.queue.add(
        'refresh-immediate',
        {},
        {
          priority: 1 // High priority
        }
      );

      console.log('[Dashboard Queue] Triggered immediate refresh');
      return job;

    } catch (error) {
      console.error('[Dashboard Queue] Failed to trigger immediate refresh:', error.message);
      return null;
    }
  }

  /**
   * Get queue instance
   */
  getQueue() {
    return this.queue;
  }

  /**
   * Close the queue
   */
  async close() {
    if (this.queue) {
      await this.queue.close();
      console.log('[Dashboard Queue] Queue closed');
    }
  }
}

// Export singleton instance
module.exports = new DashboardQueue();
