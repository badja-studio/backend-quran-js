const express = require('express');
const router = express.Router();
const exportController = require('../controller/export.controller');
const authMiddleware = require('../middleware/auth.middleware');
const exportQueue = require('../queues/export.queue');
const redisManager = require('../../config/redis');
const { Job } = require('bullmq');

/**
 * Export Routes
 * All routes require authentication
 */

// Job status endpoint
router.get('/status/:jobId', authMiddleware.authenticateToken, async (req, res) => {
    try {
        const { jobId } = req.params;

        // Get job from queue
        const job = await Job.fromId(exportQueue.queue, jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Export job not found'
            });
        }

        // Get job state
        const state = await job.getState();

        if (state === 'completed') {
            // Job completed - retrieve result from Redis
            const redis = redisManager.getCacheClient();
            const resultKey = `quran:export:result:${jobId}`;
            const result = await redis.get(resultKey);

            if (!result) {
                return res.status(410).json({
                    success: false,
                    message: 'Export result has expired. Please request a new export.'
                });
            }

            // Convert base64 result back to buffer
            const buffer = Buffer.from(result, 'base64');

            // Determine content type based on format
            const format = job.data.format || 'excel';
            const entity = job.data.entity || 'export';
            const contentType = format === 'pdf'
                ? 'application/pdf'
                : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const extension = format === 'pdf' ? 'pdf' : 'xlsx';
            const filename = `${entity}-${new Date().toISOString().split('T')[0]}.${extension}`;

            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.send(buffer);

        } else if (state === 'failed') {
            // Job failed
            return res.status(500).json({
                success: false,
                message: 'Export job failed',
                error: job.failedReason || 'Unknown error',
                jobId
            });

        } else if (state === 'active') {
            // Job is being processed
            return res.status(202).json({
                success: true,
                status: 'processing',
                progress: job.progress || 0,
                jobId,
                message: 'Export is being processed'
            });

        } else if (state === 'waiting' || state === 'delayed') {
            // Job is queued
            return res.status(202).json({
                success: true,
                status: 'queued',
                progress: 0,
                jobId,
                message: 'Export job is queued and will be processed soon'
            });

        } else {
            // Unknown state
            return res.status(200).json({
                success: true,
                status: state,
                progress: job.progress || 0,
                jobId
            });
        }

    } catch (error) {
        console.error('Error in export status endpoint:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get export job status'
        });
    }
});

// Participants export routes
router.get('/participants/excel', 
    authMiddleware.authenticateToken, 
    exportController.exportParticipantsExcel
);

router.get('/participants/pdf', 
    authMiddleware.authenticateToken, 
    exportController.exportParticipantsPDF
);

// Participants not assessed export routes
router.get('/participants/not-assessed/excel', 
    authMiddleware.authenticateToken, 
    exportController.exportParticipantsNotAssessedExcel
);

router.get('/participants/not-assessed/pdf', 
    authMiddleware.authenticateToken, 
    exportController.exportParticipantsNotAssessedPDF
);

// Participants ready to assess export routes
router.get('/participants/ready-to-assess/excel', 
    authMiddleware.authenticateToken, 
    exportController.exportParticipantsReadyToAssessExcel
);

router.get('/participants/ready-to-assess/pdf', 
    authMiddleware.authenticateToken, 
    exportController.exportParticipantsReadyToAssessPDF
);

// Assessors export routes
router.get('/assessors/excel', 
    authMiddleware.authenticateToken, 
    exportController.exportAssessorsExcel
);

router.get('/assessors/pdf', 
    authMiddleware.authenticateToken, 
    exportController.exportAssessorsPDF
);

// Assessments export routes
router.get('/assessments/excel', 
    authMiddleware.authenticateToken, 
    exportController.exportAssessmentsExcel
);

router.get('/assessments/pdf', 
    authMiddleware.authenticateToken, 
    exportController.exportAssessmentsPDF
);

module.exports = router;
