const assessorUseCase = require('../usecase/assessor.usecase');

class AssessorController {
    /**
     * Get all assessees assigned to this assessor
     */
    async getMyAssessees(req, res) {
        try {
            const result = await assessorUseCase.getMyAssessees(req.user.id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Get assessee detail with criteria
     */
    async getAssesseeDetail(req, res) {
        try {
            const result = await assessorUseCase.getAssesseeDetail(req.user.id, req.params.id);
            const statusCode = result.success ? 200 : 403;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Submit assessments for an assessee
     */
    async submitAssessments(req, res) {
        try {
            const result = await assessorUseCase.submitAssessments(
                req.user.id,
                req.params.assesseeId,
                req.body.assessments
            );
            const statusCode = result.success ? 200 : 400;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Update a specific assessment
     */
    async updateAssessment(req, res) {
        try {
            const result = await assessorUseCase.updateAssessment(
                req.user.id,
                req.params.id,
                req.body
            );
            const statusCode = result.success ? 200 : 400;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * Get all assessments given by this assessor
     */
    async getMyAssessments(req, res) {
        try {
            const result = await assessorUseCase.getMyAssessments(req.user.id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = new AssessorController();
