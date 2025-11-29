const participantUsecase = require('../usecase/participant.usecase');

class ParticipantController {
  async getAllParticipants(req, res) {
    try {
      // Parse filters from query parameter
      let filters = [];
      if (req.query.filters) {
        try {
          // If filters is passed as JSON string
          if (typeof req.query.filters === 'string') {
            filters = JSON.parse(req.query.filters);
          }
          // If filters is already parsed (from body in POST requests)
          else if (Array.isArray(req.query.filters)) {
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

      const result = await participantUsecase.getAllParticipants(options);

      res.status(200).json({
        success: true,
        message: 'Participants retrieved successfully',
        ...result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getParticipantById(req, res) {
    try {
      const { id } = req.params;
      const participant = await participantUsecase.getParticipantById(id);

      res.status(200).json({
        success: true,
        message: 'Participant retrieved successfully',
        data: participant
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
      const participant = await participantUsecase.getParticipantByUserId(userId);

      res.status(200).json({
        success: true,
        message: 'Participant profile retrieved successfully',
        data: participant
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async getNotAssessedParticipants(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search || '',
        sortBy: req.query.sortBy || 'created_at',
        sortOrder: req.query.sortOrder || 'DESC'
      };

      const result = await participantUsecase.getNotAssessedParticipants(options);

      res.status(200).json({
        success: true,
        message: 'Not assessed participants retrieved successfully',
        ...result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getReadyToAssessParticipants(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search || '',
        sortBy: req.query.sortBy || 'created_at',
        sortOrder: req.query.sortOrder || 'DESC'
      };

      const result = await participantUsecase.getReadyToAssessParticipants(options);

      res.status(200).json({
        success: true,
        message: 'Ready to assess participants retrieved successfully',
        ...result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getParticipantAssessments(req, res) {
    try {
      const { id } = req.params;
      const participant = await participantUsecase.getParticipantAssessments(id);

      res.status(200).json({
        success: true,
        message: 'Participant assessments retrieved successfully',
        data: participant
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
      const participant = await participantUsecase.getParticipantByUserId(userId);
      const participantWithAssessments = await participantUsecase.getParticipantAssessments(participant.id);

      res.status(200).json({
        success: true,
        message: 'My assessments retrieved successfully',
        data: participantWithAssessments
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async createParticipant(req, res) {
    try {
      const participantData = req.body;
      const participant = await participantUsecase.createParticipant(participantData);

      res.status(201).json({
        success: true,
        message: 'Participant created successfully',
        data: participant
      });
    } catch (error) {
      const statusCode = error.message.includes('already exists') || error.message.includes('required') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateParticipant(req, res) {
    try {
      const { id } = req.params;
      const participantData = req.body;
      const participant = await participantUsecase.updateParticipant(id, participantData);

      res.status(200).json({
        success: true,
        message: 'Participant updated successfully',
        data: participant
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteParticipant(req, res) {
    try {
      const { id } = req.params;
      const result = await participantUsecase.deleteParticipant(id);

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

  async assignAssessor(req, res) {
    try {
      const { id } = req.params;
      const { asesor_id } = req.body;

      if (!asesor_id) {
        return res.status(400).json({
          success: false,
          message: 'asesor_id is required'
        });
      }

      const participant = await participantUsecase.assignAssessor(id, asesor_id);

      res.status(200).json({
        success: true,
        message: 'Assessor assigned successfully',
        data: participant
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'status is required'
        });
      }

      const participant = await participantUsecase.updateStatus(id, status);

      res.status(200).json({
        success: true,
        message: 'Participant status updated successfully',
        data: participant
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') || error.message.includes('Invalid status') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  async getStatistics(req, res) {
    try {
      const statistics = await participantUsecase.getParticipantStatistics();

      res.status(200).json({
        success: true,
        message: 'Participant statistics retrieved successfully',
        data: statistics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ParticipantController();
