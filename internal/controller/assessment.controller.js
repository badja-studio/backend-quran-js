const assessmentUsecase = require('../usecase/assessment.usecase');

class AssessmentController {
  async getAllAssessments(req, res) {
    try {
      // Parse filters from query parameter
      let filters = [];
      if (req.query.filters) {
        try {
          if (typeof req.query.filters === 'string') {
            filters = JSON.parse(req.query.filters);
          } else if (Array.isArray(req.query.filters)) {
            filters = req.query.filters;
          }
        } catch (error) {
          console.error('Error parsing filters:', error);
          filters = [];
        }
      }

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search || '',
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'DESC',
        filters: filters
      };

      const result = await assessmentUsecase.getAllAssessments(options);

      res.status(200).json({
        success: true,
        message: 'Assessments retrieved successfully',
        ...result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAssessmentById(req, res) {
    try {
      const { id } = req.params;
      const assessment = await assessmentUsecase.getAssessmentById(id);

      res.status(200).json({
        success: true,
        message: 'Assessment retrieved successfully',
        data: assessment
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAssessmentsByParticipant(req, res) {
    try {
      const { participantId } = req.params;
      
      // Parse filters from query parameter
      let filters = [];
      if (req.query.filters) {
        try {
          if (typeof req.query.filters === 'string') {
            filters = JSON.parse(req.query.filters);
          } else if (Array.isArray(req.query.filters)) {
            filters = req.query.filters;
          }
        } catch (error) {
          console.error('Error parsing filters:', error);
          filters = [];
        }
      }

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search || '',
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'DESC',
        filters: filters,
        noPagination: true // Default to no pagination for participant assessments
      };

      const result = await assessmentUsecase.getAssessmentsByParticipant(participantId, options);

      res.status(200).json({
        success: true,
        message: 'Participant assessments retrieved successfully',
        ...result
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMyAssessments(req, res) {
    try {
      const userId = req.user.id;
      
      // Parse filters from query parameter
      let filters = [];
      if (req.query.filters) {
        try {
          if (typeof req.query.filters === 'string') {
            filters = JSON.parse(req.query.filters);
          } else if (Array.isArray(req.query.filters)) {
            filters = req.query.filters;
          }
        } catch (error) {
          console.error('Error parsing filters:', error);
          filters = [];
        }
      }

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search || '',
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'DESC',
        filters: filters
      };

      // Assuming the user is an assessor, get their assessments
      const result = await assessmentUsecase.getAssessmentsByAssessor(userId, options);

      res.status(200).json({
        success: true,
        message: 'My assessments retrieved successfully',
        ...result
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAssessmentsByAssessor(req, res) {
    try {
      const { assessorId } = req.params;
      
      // Parse filters from query parameter
      let filters = [];
      if (req.query.filters) {
        try {
          if (typeof req.query.filters === 'string') {
            filters = JSON.parse(req.query.filters);
          } else if (Array.isArray(req.query.filters)) {
            filters = req.query.filters;
          }
        } catch (error) {
          console.error('Error parsing filters:', error);
          filters = [];
        }
      }

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search || '',
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'DESC',
        filters: filters
      };

      const result = await assessmentUsecase.getAssessmentsByAssessor(assessorId, options);

      res.status(200).json({
        success: true,
        message: 'Assessor assessments retrieved successfully',
        ...result
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async createAssessment(req, res) {
    try {
      const assessmentData = req.body;
      const assessment = await assessmentUsecase.createAssessment(assessmentData);

      res.status(201).json({
        success: true,
        message: 'Assessment created successfully',
        data: assessment
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') || 
                        error.message.includes('required') ||
                        error.message.includes('not assigned') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async createBulkAssessments(req, res) {
    try {
      const { assessments } = req.body;

      if (!assessments || !Array.isArray(assessments)) {
        return res.status(400).json({
          success: false,
          message: 'assessments field is required and must be an array'
        });
      }

      const result = await assessmentUsecase.createBulkAssessments(assessments);

      res.status(201).json({
        success: true,
        message: `${result.length} assessments created successfully`,
        data: result
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') || 
                        error.message.includes('required') ||
                        error.message.includes('not assigned') ||
                        error.message.includes('must be') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateAssessment(req, res) {
    try {
      const { id } = req.params;
      const assessmentData = req.body;
      const assessment = await assessmentUsecase.updateAssessment(id, assessmentData);

      res.status(200).json({
        success: true,
        message: 'Assessment updated successfully',
        data: assessment
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteAssessment(req, res) {
    try {
      const { id } = req.params;
      const result = await assessmentUsecase.deleteAssessment(id);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteAssessmentsByParticipantAndAssessor(req, res) {
    try {
      const { participantId, assessorId } = req.params;
      const result = await assessmentUsecase.deleteAssessmentsByParticipantAndAssessor(participantId, assessorId);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async getParticipantAssessmentSummary(req, res) {
    try {
      const { participantId } = req.params;
      const summary = await assessmentUsecase.getParticipantAssessmentSummary(participantId);

      res.status(200).json({
        success: true,
        message: 'Participant assessment summary retrieved successfully',
        data: summary
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAssessorAssessmentSummary(req, res) {
    try {
      const { assessorId } = req.params;
      const summary = await assessmentUsecase.getAssessorAssessmentSummary(assessorId);

      res.status(200).json({
        success: true,
        message: 'Assessor assessment summary retrieved successfully',
        data: summary
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMyAssessmentSummary(req, res) {
    try {
      const userId = req.user.id;
      // Assuming user is assessor - if you need participant summary, you'll need to check user role
      const summary = await assessmentUsecase.getAssessorAssessmentSummary(userId);

      res.status(200).json({
        success: true,
        message: 'My assessment summary retrieved successfully',
        data: summary
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AssessmentController();
