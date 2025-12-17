const exportUseCase = require('../../usecase/export.usecase');
const redisManager = require('../../../config/redis');

/**
 * Export Job Processor
 * Handles Excel and PDF export generation
 *
 * @param {Object} job - BullMQ job object
 * @param {Object} job.data - Job data
 * @param {string} job.data.entity - Entity type (participants|assessors|assessments)
 * @param {string} job.data.format - Export format (excel|pdf)
 * @param {Object} job.data.filters - Filter parameters
 * @param {number} job.data.userId - User ID who requested the export
 * @param {string} job.data.endpoint - Endpoint name for logging
 * @returns {Promise<Object>} Job result
 */
async function processExportJob(job) {
    const { data } = job;
    const { entity, format, filters, userId, endpoint } = data;

    console.log(`[ExportProcessor] Processing job ${job.id}: ${entity} ${format} for user ${userId}`);

    try {
        let buffer;
        const redis = redisManager.getCacheClient();

        if (!redis) {
            throw new Error('Redis cache client not available');
        }

        // Update job progress
        await job.updateProgress(10);

        // Generate export based on entity and format
        switch (entity) {
            case 'participants':
                buffer = await handleParticipantsExport(format, filters, job);
                break;

            case 'assessors':
                buffer = await handleAssessorsExport(format, filters, job);
                break;

            case 'assessments':
                buffer = await handleAssessmentsExport(format, filters, job);
                break;

            default:
                throw new Error(`Unknown entity type: ${entity}`);
        }

        // Update progress before storing result
        await job.updateProgress(90);

        // Store result in Redis with 1-hour TTL (base64 encoded)
        const resultKey = `quran:export:result:${job.id}`;
        const base64Buffer = buffer.toString('base64');

        await redis.setex(resultKey, 3600, base64Buffer); // 1 hour TTL

        console.log(`[ExportProcessor] Job ${job.id} completed. Result stored in Redis with key: ${resultKey}`);

        // Update progress to 100%
        await job.updateProgress(100);

        return {
            success: true,
            resultKey,
            entity,
            format,
            userId,
            endpoint,
            completedAt: new Date().toISOString()
        };

    } catch (error) {
        console.error(`[ExportProcessor] Job ${job.id} failed:`, error);
        throw error; // BullMQ will handle retries
    }
}

/**
 * Handle participants export
 */
async function handleParticipantsExport(format, filters, job) {
    await job.updateProgress(20);

    if (format === 'excel') {
        console.log('[ExportProcessor] Generating participants Excel...');
        const workbook = await exportUseCase.generateParticipantsExcel(filters);

        await job.updateProgress(80);

        // Convert workbook to buffer
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;

    } else if (format === 'pdf') {
        console.log('[ExportProcessor] Generating participants PDF...');

        // Check if this is a special endpoint
        if (filters._endpoint === 'not-assessed') {
            const buffer = await exportUseCase.generateParticipantsNotAssessedPDF(filters);
            await job.updateProgress(80);
            return buffer;
        } else if (filters._endpoint === 'ready-to-assess') {
            const buffer = await exportUseCase.generateParticipantsReadyToAssessPDF(filters);
            await job.updateProgress(80);
            return buffer;
        } else {
            const buffer = await exportUseCase.generateParticipantsPDFFromExcel(filters);
            await job.updateProgress(80);
            return buffer;
        }
    } else {
        throw new Error(`Unknown format: ${format}`);
    }
}

/**
 * Handle assessors export
 */
async function handleAssessorsExport(format, filters, job) {
    await job.updateProgress(20);

    if (format === 'excel') {
        console.log('[ExportProcessor] Generating assessors Excel...');
        const workbook = await exportUseCase.generateAssessorsExcel(filters);

        await job.updateProgress(80);

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;

    } else if (format === 'pdf') {
        console.log('[ExportProcessor] Generating assessors PDF...');
        const buffer = await exportUseCase.generateAssessorsPDFFromExcel(filters);

        await job.updateProgress(80);

        return buffer;
    } else {
        throw new Error(`Unknown format: ${format}`);
    }
}

/**
 * Handle assessments export
 */
async function handleAssessmentsExport(format, filters, job) {
    await job.updateProgress(20);

    if (format === 'excel') {
        console.log('[ExportProcessor] Generating assessments Excel...');
        const workbook = await exportUseCase.generateAssessmentsExcel(filters);

        await job.updateProgress(80);

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;

    } else if (format === 'pdf') {
        console.log('[ExportProcessor] Generating assessments PDF...');
        const buffer = await exportUseCase.generateAssessmentsPDFFromExcel(filters);

        await job.updateProgress(80);

        return buffer;
    } else {
        throw new Error(`Unknown format: ${format}`);
    }
}

module.exports = {
    processExportJob
};
