const participantUsecase = require('../usecase/participant.usecase');

class ParticipantController {
  async getAllParticipants(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        search: req.query.search || '',
        sortBy: req.query.sortBy || 'created_at',
        sortOrder: req.query.sortOrder || 'DESC',
        filters: {
          jenis_kelamin: req.query.jenis_kelamin,
          provinsi: req.query.provinsi,
          kab_kota: req.query.kab_kota,
          jenjang: req.query.jenjang,
          level: req.query.level,
          status: req.query.status,
          asesor_id: req.query.asesor_id
        }
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
