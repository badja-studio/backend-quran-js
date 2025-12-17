const exportQueue = require('../queues/export.queue');

class ExportController {
    // Export participants to Excel
    async exportParticipantsExcel(req, res) {
        try {
            const filters = req.query;
            const userId = req.user?.id || 'anonymous';

            const job = await exportQueue.addExportJob({
                entity: 'participants',
                format: 'excel',
                filters,
                userId,
                endpoint: 'participants-excel'
            });

            res.status(202).json({
                success: true,
                message: 'Export job queued successfully',
                jobId: job.id,
                statusUrl: `/api/export/status/${job.id}`
            });
        } catch (error) {
            console.error('Error in exportParticipantsExcel:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to queue export job'
            });
        }
    }

    // Export participants to PDF (Excel data rendered as PDF)
    async exportParticipantsPDF(req, res) {
        try {
            const filters = req.query;
            const userId = req.user?.id || 'anonymous';

            const job = await exportQueue.addExportJob({
                entity: 'participants',
                format: 'pdf',
                filters,
                userId,
                endpoint: 'participants-pdf'
            });

            res.status(202).json({
                success: true,
                message: 'Export job queued successfully',
                jobId: job.id,
                statusUrl: `/api/export/status/${job.id}`
            });
        } catch (error) {
            console.error('Error in exportParticipantsPDF:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to queue export job'
            });
        }
    }

    // Export assessors to Excel
    async exportAssessorsExcel(req, res) {
        try {
            const filters = req.query;
            const userId = req.user?.id || 'anonymous';

            const job = await exportQueue.addExportJob({
                entity: 'assessors',
                format: 'excel',
                filters,
                userId,
                endpoint: 'assessors-excel'
            });

            res.status(202).json({
                success: true,
                message: 'Export job queued successfully',
                jobId: job.id,
                statusUrl: `/api/export/status/${job.id}`
            });
        } catch (error) {
            console.error('Error in exportAssessorsExcel:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to queue export job'
            });
        }
    }

    // Export assessors to PDF (Excel data rendered as PDF)
    async exportAssessorsPDF(req, res) {
        try {
            const filters = req.query;
            const userId = req.user?.id || 'anonymous';

            const job = await exportQueue.addExportJob({
                entity: 'assessors',
                format: 'pdf',
                filters,
                userId,
                endpoint: 'assessors-pdf'
            });

            res.status(202).json({
                success: true,
                message: 'Export job queued successfully',
                jobId: job.id,
                statusUrl: `/api/export/status/${job.id}`
            });
        } catch (error) {
            console.error('Error in exportAssessorsPDF:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to queue export job'
            });
        }
    }

    // Export assessments to Excel
    async exportAssessmentsExcel(req, res) {
        try {
            const filters = req.query;
            const userId = req.user?.id || 'anonymous';

            const job = await exportQueue.addExportJob({
                entity: 'assessments',
                format: 'excel',
                filters,
                userId,
                endpoint: 'assessments-excel'
            });

            res.status(202).json({
                success: true,
                message: 'Export job queued successfully',
                jobId: job.id,
                statusUrl: `/api/export/status/${job.id}`
            });
        } catch (error) {
            console.error('Error in exportAssessmentsExcel:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to queue export job'
            });
        }
    }

    // Export assessments to PDF (Excel data rendered as PDF)
    async exportAssessmentsPDF(req, res) {
        try {
            const filters = req.query;
            const userId = req.user?.id || 'anonymous';

            const job = await exportQueue.addExportJob({
                entity: 'assessments',
                format: 'pdf',
                filters,
                userId,
                endpoint: 'assessments-pdf'
            });

            res.status(202).json({
                success: true,
                message: 'Export job queued successfully',
                jobId: job.id,
                statusUrl: `/api/export/status/${job.id}`
            });
        } catch (error) {
            console.error('Error in exportAssessmentsPDF:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to queue export job'
            });
        }
    }

    // Export participants by status (not assessed)
    async exportParticipantsNotAssessedExcel(req, res) {
        try {
            const filters = {
                ...req.query,
                status: 'BELUM',
                _endpoint: 'not-assessed'
            };
            const userId = req.user?.id || 'anonymous';

            const job = await exportQueue.addExportJob({
                entity: 'participants',
                format: 'excel',
                filters,
                userId,
                endpoint: 'participants-not-assessed-excel'
            });

            res.status(202).json({
                success: true,
                message: 'Export job queued successfully',
                jobId: job.id,
                statusUrl: `/api/export/status/${job.id}`
            });
        } catch (error) {
            console.error('Error in exportParticipantsNotAssessedExcel:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to queue export job'
            });
        }
    }

    async exportParticipantsNotAssessedPDF(req, res) {
        try {
            const filters = {
                ...req.query,
                status: 'BELUM',
                _endpoint: 'not-assessed'
            };
            const userId = req.user?.id || 'anonymous';

            const job = await exportQueue.addExportJob({
                entity: 'participants',
                format: 'pdf',
                filters,
                userId,
                endpoint: 'participants-not-assessed-pdf'
            });

            res.status(202).json({
                success: true,
                message: 'Export job queued successfully',
                jobId: job.id,
                statusUrl: `/api/export/status/${job.id}`
            });
        } catch (error) {
            console.error('Error in exportParticipantsNotAssessedPDF:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to queue export job'
            });
        }
    }

    // Export participants ready to assess
    async exportParticipantsReadyToAssessExcel(req, res) {
        try {
            const filters = {
                ...req.query,
                status: 'BELUM',
                hasAssessor: true,
                _endpoint: 'ready-to-assess'
            };
            const userId = req.user?.id || 'anonymous';

            const job = await exportQueue.addExportJob({
                entity: 'participants',
                format: 'excel',
                filters,
                userId,
                endpoint: 'participants-ready-to-assess-excel'
            });

            res.status(202).json({
                success: true,
                message: 'Export job queued successfully',
                jobId: job.id,
                statusUrl: `/api/export/status/${job.id}`
            });
        } catch (error) {
            console.error('Error in exportParticipantsReadyToAssessExcel:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to queue export job'
            });
        }
    }

    async exportParticipantsReadyToAssessPDF(req, res) {
        try {
            const filters = {
                ...req.query,
                status: 'BELUM',
                hasAssessor: true,
                _endpoint: 'ready-to-assess'
            };
            const userId = req.user?.id || 'anonymous';

            const job = await exportQueue.addExportJob({
                entity: 'participants',
                format: 'pdf',
                filters,
                userId,
                endpoint: 'participants-ready-to-assess-pdf'
            });

            res.status(202).json({
                success: true,
                message: 'Export job queued successfully',
                jobId: job.id,
                statusUrl: `/api/export/status/${job.id}`
            });
        } catch (error) {
            console.error('Error in exportParticipantsReadyToAssessPDF:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to queue export job'
            });
        }
    }
}

module.exports = new ExportController();
