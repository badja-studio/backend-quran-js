const adminUseCase = require('../usecase/admin.usecase');

class AdminController {
    // ==================== CRITERIA GROUP ENDPOINTS ====================
    
    async createCriteriaGroup(req, res) {
        try {
            const result = await adminUseCase.createCriteriaGroup(req.body);
            const statusCode = result.success ? 201 : 400;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async getCriteriaGroups(req, res) {
        try {
            const result = await adminUseCase.getCriteriaGroups();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async getCriteriaGroupById(req, res) {
        try {
            const result = await adminUseCase.getCriteriaGroupById(req.params.id);
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async updateCriteriaGroup(req, res) {
        try {
            const result = await adminUseCase.updateCriteriaGroup(req.params.id, req.body);
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async deleteCriteriaGroup(req, res) {
        try {
            const result = await adminUseCase.deleteCriteriaGroup(req.params.id);
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // ==================== CRITERION ENDPOINTS ====================
    
    async addCriterion(req, res) {
        try {
            const result = await adminUseCase.addCriterion(req.params.groupId, req.body);
            const statusCode = result.success ? 201 : 400;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async updateCriterion(req, res) {
        try {
            const result = await adminUseCase.updateCriterion(req.params.id, req.body);
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async deleteCriterion(req, res) {
        try {
            const result = await adminUseCase.deleteCriterion(req.params.id);
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // ==================== SCHEDULE ENDPOINTS ====================
    
    async createSchedule(req, res) {
        try {
            const result = await adminUseCase.createSchedule(req.body);
            const statusCode = result.success ? 201 : 400;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async getSchedules(req, res) {
        try {
            const result = await adminUseCase.getSchedules();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async getScheduleById(req, res) {
        try {
            const result = await adminUseCase.getScheduleById(req.params.id);
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async updateSchedule(req, res) {
        try {
            const result = await adminUseCase.updateSchedule(req.params.id, req.body);
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async deleteSchedule(req, res) {
        try {
            const result = await adminUseCase.deleteSchedule(req.params.id);
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async addAssesseesToSchedule(req, res) {
        try {
            const result = await adminUseCase.addAssesseesToSchedule(
                req.params.id,
                req.body.assesseeIds
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

    async removeAssesseeFromSchedule(req, res) {
        try {
            const result = await adminUseCase.removeAssesseeFromSchedule(
                req.params.scheduleId,
                req.params.assesseeId
            );
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    // ==================== ASSESSEE ENDPOINTS ====================
    
    async getAllAssessees(req, res) {
        try {
            const result = await adminUseCase.getAllAssessees();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async getAssesseeById(req, res) {
        try {
            const result = await adminUseCase.getAssesseeById(req.params.id);
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async assignAssessorToAssessee(req, res) {
        try {
            const result = await adminUseCase.assignAssessorToAssessee(
                req.params.id,
                req.body.assessorId
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

    async removeAssessorFromAssessee(req, res) {
        try {
            const result = await adminUseCase.removeAssessorFromAssessee(
                req.params.assesseeId,
                req.params.assessorId
            );
            const statusCode = result.success ? 200 : 404;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async assignCriteriaGroupToAssessee(req, res) {
        try {
            const result = await adminUseCase.assignCriteriaGroupToAssessee(
                req.params.id,
                req.body.criteriaGroupId
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

    // ==================== ASSESSOR ENDPOINTS ====================
    
    async getAllAssessors(req, res) {
        try {
            const result = await adminUseCase.getAllAssessors();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    async getAssessorAssessees(req, res) {
        try {
            const result = await adminUseCase.getAssessorAssessees(req.params.id);
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

module.exports = new AdminController();
