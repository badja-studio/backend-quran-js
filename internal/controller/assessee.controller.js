const assesseeUseCase = require('../usecase/assessee.usecase');

class AssesseeController {
    /**
     * Get assessee profile
     */
    async getProfile(req, res) {
        try {
            const result = await assesseeUseCase.getProfile(req.user.id);
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
     * Get all assessments received by this assessee
     */
    async getMyAssessments(req, res) {
        try {
            const result = await assesseeUseCase.getMyAssessments(req.user.id);
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
     * Get assessment summary with averages
     */
    async getAssessmentSummary(req, res) {
        try {
            const result = await assesseeUseCase.getAssessmentSummary(req.user.id);
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
     * Get assessee schedule
     */
    async getMySchedule(req, res) {
        try {
            const result = await assesseeUseCase.getMySchedule(req.user.id);
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

module.exports = new AssesseeController();
