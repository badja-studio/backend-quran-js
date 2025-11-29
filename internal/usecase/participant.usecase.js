const participantRepository = require('../repository/participant.repository');
const assessorRepository = require('../repository/assessor.repository');

class ParticipantUsecase {
  async getAllParticipants(options) {
    try {
      return await participantRepository.findAll(options);
    } catch (error) {
      throw new Error(`Failed to get participants: ${error.message}`);
    }
  }

  async getParticipantById(id) {
    try {
      const participant = await participantRepository.findById(id);
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
    try {
      // Validate required fields
      const requiredFields = ['no_akun', 'nip', 'nama', 'jenis_kelamin', 'akun_id'];
      for (const field of requiredFields) {
        if (!participantData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Check if participant already exists
      const existingParticipant = await participantRepository.findByUserId(participantData.akun_id);
      if (existingParticipant) {
        throw new Error('Participant already exists for this user');
      }

      const participant = await participantRepository.create({
        ...participantData,
        status: 'BELUM'
      });

      return participant;
    } catch (error) {
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
