const participantRepository = require('../repository/participant.repository');
const assessorRepository = require('../repository/assessor.repository');
const authRepository = require('../repository/auth.repository');
const { sequelize } = require('../../config/database');

class ParticipantUsecase {
  async getAllParticipants(options) {
    try {
      // Use the enhanced method that includes scoring
      return await participantRepository.findAllWithScores(options);
    } catch (error) {
      throw new Error(`Failed to get participants: ${error.message}`);
    }
  }

  async getParticipantById(id) {
    try {
      // Use the enhanced method that includes scoring
      const participant = await participantRepository.findByIdWithScores(id);
      if (!participant) {
        throw new Error('Participant not found');
      }
      return participant;
    } catch (error) {
      throw new Error(`Failed to get participant: ${error.message}`);
    }
  }

  async getParticipantByUserId(userId) {
    try {
      const participant = await participantRepository.findByUserId(userId);
      if (!participant) {
        throw new Error('Participant not found for this user');
      }
      return participant;
    } catch (error) {
      throw new Error(`Failed to get participant by user ID: ${error.message}`);
    }
  }

  async getNotAssessedParticipants(options) {
    try {
      return await participantRepository.findNotAssessed(options);
    } catch (error) {
      throw new Error(`Failed to get not assessed participants: ${error.message}`);
    }
  }

  async getReadyToAssessParticipants(options) {
    try {
      return await participantRepository.findReadyToAssess(options);
    } catch (error) {
      throw new Error(`Failed to get ready to assess participants: ${error.message}`);
    }
  }

  async getParticipantAssessments(participantId) {
    try {
      const participant = await participantRepository.findParticipantAssessments(participantId);
      if (!participant) {
        throw new Error('Participant not found');
      }
      return participant;
    } catch (error) {
      throw new Error(`Failed to get participant assessments: ${error.message}`);
    }
  }

  async createParticipant(participantData) {
    const transaction = await sequelize.transaction();
    
    try {
      // Validate required fields (removed akun_id since we'll create it)
      const requiredFields = ['no_akun', 'nip', 'nama', 'jenis_kelamin'];
      for (const field of requiredFields) {
        if (!participantData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Check if participant with same NIP already exists
      const existingParticipant = await participantRepository.findByNip(participantData.nip);
      if (existingParticipant) {
        throw new Error('Participant with this NIP already exists');
      }

      // Create user account first with NIP as username and password
      const userData = {
        username: participantData.nip,
        password: participantData.nip, // Password same as NIP
        role: 'participant'
      };

      const user = await authRepository.createUser(userData);

      // Create participant with the user account ID
      const participant = await participantRepository.create({
        ...participantData,
        akun_id: user.id,
        status: 'BELUM'
      }, { transaction });

      await transaction.commit();

      // Return participant with user info
      return {
        ...participant.toJSON(),
        akun: {
          id: user.id,
          username: user.username,
          role: user.role
        },
        loginCredentials: {
          username: userData.username,
          password: participantData.nip // Return original password for first-time login info
        }
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to create participant: ${error.message}`);
    }
  }

  async updateParticipant(id, participantData) {
    try {
      const participant = await participantRepository.update(id, participantData);
      if (!participant) {
        throw new Error('Participant not found');
      }
      return participant;
    } catch (error) {
      throw new Error(`Failed to update participant: ${error.message}`);
    }
  }

  async deleteParticipant(id) {
    try {
      const participant = await participantRepository.findById(id);
      if (!participant) {
        throw new Error('Participant not found');
      }

      const deleted = await participantRepository.delete(id);
      if (!deleted) {
        throw new Error('Failed to delete participant');
      }

      return { message: 'Participant deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete participant: ${error.message}`);
    }
  }

  async assignAssessor(participantId, assessorId) {
    try {
      // Check if participant exists
      const participant = await participantRepository.findById(participantId);
      if (!participant) {
        throw new Error('Participant not found');
      }

      // Check if assessor exists
      const assessor = await assessorRepository.findById(assessorId);
      if (!assessor) {
        throw new Error('Assessor not found');
      }

      const updatedParticipant = await participantRepository.assignAssessor(participantId, assessorId);
      if (!updatedParticipant) {
        throw new Error('Failed to assign assessor');
      }

      // Update assessor participant counts
      await assessorRepository.updateParticipantCounts(assessorId);

      return updatedParticipant;
    } catch (error) {
      throw new Error(`Failed to assign assessor: ${error.message}`);
    }
  }

  async updateStatus(participantId, status) {
    try {
      // Validate status
      if (!['SUDAH', 'BELUM'].includes(status)) {
        throw new Error('Invalid status. Must be SUDAH or BELUM');
      }

      const participant = await participantRepository.findById(participantId);
      if (!participant) {
        throw new Error('Participant not found');
      }

      const updatedParticipant = await participantRepository.updateStatus(participantId, status);
      if (!updatedParticipant) {
        throw new Error('Failed to update status');
      }

      // Update assessor participant counts if participant has assessor
      if (participant.asesor_id) {
        await assessorRepository.updateParticipantCounts(participant.asesor_id);
      }

      return updatedParticipant;
    } catch (error) {
      throw new Error(`Failed to update participant status: ${error.message}`);
    }
  }

  async getParticipantStatistics() {
    try {
      return await participantRepository.countByStatus();
    } catch (error) {
      throw new Error(`Failed to get participant statistics: ${error.message}`);
    }
  }
}

module.exports = new ParticipantUsecase();
