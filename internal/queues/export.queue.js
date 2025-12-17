const { Queue } = require('bullmq');
const redisManager = require('../../config/redis');
const config = require('../../config/config');

/**
 * Export Job Queue
 * Handles Excel and PDF export operations
 *
 * Queue Config:
 * - Name: export-jobs
 * - Concurrency: 2 (configurable via env)
 * - Timeout: 5 minutes per job
 * - Priority: PDF=high, Excel=normal
 * - Retry: 3 attempts with exponential backoff
 */
class ExportQueue {
    constructor() {
        this.queue = null;
    }

    /**
     * Initialize export queue
     */
    async initialize() {
        try {
            const queueConnection = redisManager.getQueueClient();

            if (!queueConnection) {
                console.warn('[ExportQueue] Queue client not initialized. Export jobs will not be processed.');
                return;
            }

            this.queue = new Queue('export-jobs', {
                connection: queueConnection,
                defaultJobOptions: {
                    attempts: 3, // Retry 3 times on failure
                    backoff: {
                        type: 'exponential',
                        delay: 5000 // Start with 5s delay, then 10s, 20s
                    },
                    removeOnComplete: {
                        age: 3600, // Keep completed jobs for 1 hour
                        count: 100 // Keep last 100 completed jobs
                    },
                    removeOnFail: {
                        age: 86400 // Keep failed jobs for 24 hours
                    }
                }
            });

            console.log('[ExportQueue] Export queue initialized successfully');
        } catch (error) {
            console.error('[ExportQueue] Failed to initialize export queue:', error);
            throw error;
        }
    }

    /**
     * Add export job to queue
     *
     * @param {Object} jobData - Job data
     * @param {string} jobData.entity - Entity type (participants|assessors|assessments)
     * @param {string} jobData.format - Export format (excel|pdf)
     * @param {Object} jobData.filters - Filter parameters
     * @param {number} jobData.userId - User ID who requested the export
     * @param {string} jobData.endpoint - Endpoint name for logging
     * @returns {Promise<Object>} Job object
     */
    async addExportJob(jobData) {
        try {
            if (!this.queue) {
                throw new Error('Export queue not initialized');
            }

            const { entity, format, filters, userId, endpoint } = jobData;

            // Determine priority: PDF exports are higher priority due to Puppeteer overhead
            const priority = format === 'pdf' ? 1 : 2;

            const job = await this.queue.add(`export-${entity}-${format}`, {
                entity,
                format,
                filters,
                userId,
                endpoint,
                requestedAt: new Date().toISOString()
            }, {
                priority,
                timeout: config.worker.exportTimeout || 300000, // 5 minutes default
                jobId: `export-${entity}-${format}-${userId}-${Date.now()}`
            });

            console.log(`[ExportQueue] Job added: ${job.id} (${entity} ${format})`);
            return job;
        } catch (error) {
            console.error('[ExportQueue] Failed to add export job:', error);
            throw error;
        }
    }

    /**
     * Get job status by ID
     *
     * @param {string} jobId - Job ID
     * @returns {Promise<Object>} Job status
     */
    async getJobStatus(jobId) {
        try {
            if (!this.queue) {
                throw new Error('Export queue not initialized');
            }

            const job = await this.queue.getJob(jobId);

            if (!job) {
                return { status: 'not_found' };
            }

            const state = await job.getState();
            const progress = job.progress || 0;
            const failedReason = job.failedReason || null;

            return {
                status: state,
                progress,
                failedReason,
                data: job.data
            };
        } catch (error) {
            console.error('[ExportQueue] Failed to get job status:', error);
            throw error;
        }
    }

    /**
     * Get queue metrics
     *
     * @returns {Promise<Object>} Queue metrics
     */
    async getMetrics() {
        try {
            if (!this.queue) {
                return { error: 'Queue not initialized' };
            }

            const [waiting, active, completed, failed, delayed] = await Promise.all([
                this.queue.getWaitingCount(),
                this.queue.getActiveCount(),
                this.queue.getCompletedCount(),
                this.queue.getFailedCount(),
                this.queue.getDelayedCount()
            ]);

            return {
                waiting,
                active,
                completed,
                failed,
                delayed,
                total: waiting + active + completed + failed + delayed
            };
        } catch (error) {
            console.error('[ExportQueue] Failed to get metrics:', error);
            throw error;
        }
    }

    /**
     * Clean up old jobs
     */
    async cleanup() {
        try {
            if (!this.queue) {
                return;
            }

            // Remove completed jobs older than 1 hour
            await this.queue.clean(3600000, 100, 'completed');

            // Remove failed jobs older than 24 hours
            await this.queue.clean(86400000, 50, 'failed');

            console.log('[ExportQueue] Queue cleanup completed');
        } catch (error) {
            console.error('[ExportQueue] Failed to cleanup queue:', error);
        }
    }

    /**
     * Close queue connection
     */
    async close() {
        try {
            if (this.queue) {
                await this.queue.close();
                console.log('[ExportQueue] Queue closed');
            }
        } catch (error) {
            console.error('[ExportQueue] Failed to close queue:', error);
        }
    }
}

// Export singleton instance
module.exports = new ExportQueue();
