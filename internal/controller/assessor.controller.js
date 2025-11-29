const assessorUsecase = require('../usecase/assessor.usecase');

class AssessorController {
  async getAllAssessors(req, res) {
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

      const result = await assessorUsecase.getAllAssessors(options);

      res.status(200).json({
        success: true,
        message: 'Assessors retrieved successfully',
        ...result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAssessorById(req, res) {
    try {
      const { id } = req.params;
      const assessor = await assessorUsecase.getAssessorById(id);

      res.status(200).json({
        success: true,
        message: 'Assessor retrieved successfully',
        data: assessor
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMyProfile(req, res) {
    try {
      const userId = req.user.id;
      const assessor = await assessorUsecase.getAssessorByUserId(userId);

      res.status(200).json({
        success: true,
        message: 'Assessor profile retrieved successfully',
        data: assessor
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMyParticipants(req, res) {
    try {
      const userId = req.user.id;
      const assessor = await assessorUsecase.getAssessorByUserId(userId);
      
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
        status: req.query.status, // SUDAH or BELUM
        filters: filters
      };

      const result = await assessorUsecase.getAssessorParticipants(assessor.id, options);

      res.status(200).json({
        success: true,
        message: 'My participants retrieved successfully',
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

  async getAssessorParticipants(req, res) {
    try {
      const { id } = req.params;
      
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
        status: req.query.status, // SUDAH or BELUM
        filters: filters
      };

      const result = await assessorUsecase.getAssessorParticipants(id, options);

      res.status(200).json({
        success: true,
        message: 'Assessor participants retrieved successfully',
        ...result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createAssessor(req, res) {
    try {
      const assessorData = req.body;
      const assessor = await assessorUsecase.createAssessor(assessorData);

      res.status(201).json({
        success: true,
        message: 'Assessor created successfully',
        data: assessor
      });
    } catch (error) {
      const statusCode = error.message.includes('already exists') || error.message.includes('required') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateAssessor(req, res) {
    try {
      const { id } = req.params;
      const assessorData = req.body;
      const assessor = await assessorUsecase.updateAssessor(id, assessorData);

      res.status(200).json({
        success: true,
        message: 'Assessor updated successfully',
        data: assessor
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteAssessor(req, res) {
    try {
      const { id } = req.params;
      const result = await assessorUsecase.deleteAssessor(id);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 
                        error.message.includes('Cannot delete') ? 409 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async assignParticipantToMe(req, res) {
    try {
      const userId = req.user.id;
      const { participant_id } = req.body;

      if (!participant_id) {
        return res.status(400).json({
          success: false,
          message: 'participant_id is required'
        });
      }

      const assessor = await assessorUsecase.getAssessorByUserId(userId);
      const participant = await assessorUsecase.assignParticipantToSelf(assessor.id, participant_id);

      res.status(200).json({
        success: true,
        message: 'Participant assigned to me successfully',
        data: participant
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') || 
                        error.message.includes('already assigned') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async assignParticipant(req, res) {
    try {
      const { id } = req.params; // assessor id
      const { participant_id } = req.body;

      if (!participant_id) {
        return res.status(400).json({
          success: false,
          message: 'participant_id is required'
        });
      }

      const participant = await assessorUsecase.assignParticipantToSelf(id, participant_id);

      res.status(200).json({
        success: true,
        message: 'Participant assigned successfully',
        data: participant
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') || 
                        error.message.includes('already assigned') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async unassignParticipant(req, res) {
    try {
      const { id } = req.params; // assessor id
      const { participant_id } = req.body;

      if (!participant_id) {
        return res.status(400).json({
          success: false,
          message: 'participant_id is required'
        });
      }

      const participant = await assessorUsecase.unassignParticipant(id, participant_id);

      res.status(200).json({
        success: true,
        message: 'Participant unassigned successfully',
        data: participant
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') || 
                        error.message.includes('not assigned') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMyStatistics(req, res) {
    try {
      const userId = req.user.id;
      const assessor = await assessorUsecase.getAssessorByUserId(userId);
      const statistics = await assessorUsecase.getAssessorStatistics(assessor.id);

      res.status(200).json({
        success: true,
        message: 'My statistics retrieved successfully',
        data: statistics
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAssessorStatistics(req, res) {
    try {
      const { id } = req.params;
      const statistics = await assessorUsecase.getAssessorStatistics(id);

      res.status(200).json({
        success: true,
        message: 'Assessor statistics retrieved successfully',
        data: statistics
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateParticipantCounts(req, res) {
    try {
      const { id } = req.params;
      const result = await assessorUsecase.updateParticipantCounts(id);

      res.status(200).json({
        success: true,
        message: 'Participant counts updated successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AssessorController();
