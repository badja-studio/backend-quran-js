const assessorRepository = require('../repository/assessor.repository');
const participantRepository = require('../repository/participant.repository');
const authRepository = require('../repository/auth.repository');
const { sequelize } = require('../../config/database');

class AssessorUsecase {
  async getAllAssessors(options) {
    try {
      return await assessorRepository.findAll(options);
    } catch (error) {
      throw new Error(`Failed to get assessors: ${error.message}`);
    }
  }

  async getAssessorById(id) {
    try {
      const assessor = await assessorRepository.findById(id);
      if (!assessor) {
        throw new Error('Assessor not found');
      }
      return assessor;
    } catch (error) {
      throw new Error(`Failed to get assessor: ${error.message}`);
    }
  }

  async getAssessorByUserId(userId) {
    try {
      const assessor = await assessorRepository.findByUserId(userId);
      if (!assessor) {
        throw new Error('Assessor not found for this user');
      }
      return assessor;
    } catch (error) {
      throw new Error(`Failed to get assessor by user ID: ${error.message}`);
    }
  }

  async getAssessorWithParticipants(assessorId, options) {
    try {
      const assessor = await assessorRepository.findById(assessorId);
      if (!assessor) {
        throw new Error('Assessor not found');
      }

      const participants = await assessorRepository.findWithParticipants(assessorId, options);
      
      return {
        assessor,
        participants
      };
    } catch (error) {
      throw new Error(`Failed to get assessor with participants: ${error.message}`);
    }
  }

  async getAssessorParticipants(assessorId, options) {
    try {
      return await assessorRepository.findWithParticipants(assessorId, options);
    } catch (error) {
      throw new Error(`Failed to get assessor participants: ${error.message}`);
    }
  }

  async createAssessor(assessorData) {
    const transaction = await sequelize.transaction();
    
    try {
      // Validate required fields (removed akun_id since we'll create it)
      const requiredFields = ['name', 'username', 'email'];
      for (const field of requiredFields) {
        if (!assessorData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Check if assessor with same username already exists
      const existingAssessor = await assessorRepository.findByUsername(assessorData.username);
      if (existingAssessor) {
        throw new Error('Assessor with this username already exists');
      }

      // Create user account first with username as both username and password
      const userData = {
        username: assessorData.username,
        password: assessorData.username, // Password same as username
        role: 'assessor'
      };

      const user = await authRepository.createUser(userData);

      // Create assessor with the user account ID
      const assessor = await assessorRepository.create({
        ...assessorData,
        akun_id: user.id,
        total_peserta_belum_asesmen: 0,
        total_peserta_selesai_asesmen: 0
      }, { transaction });

      await transaction.commit();

      // Return assessor with user info
      return {
        ...assessor.toJSON(),
        akun: {
          id: user.id,
          username: user.username,
          role: user.role
        },
        loginCredentials: {
          username: userData.username,
          password: assessorData.username // Return original password for first-time login info
        }
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to create assessor: ${error.message}`);
    }
  }

  async updateAssessor(id, assessorData) {
    try {
      const assessor = await assessorRepository.update(id, assessorData);
      if (!assessor) {
        throw new Error('Assessor not found');
      }
      return assessor;
    } catch (error) {
      throw new Error(`Failed to update assessor: ${error.message}`);
    }
  }

  async deleteAssessor(id) {
    try {
      const assessor = await assessorRepository.findById(id);
      if (!assessor) {
        throw new Error('Assessor not found');
      }

      // Check if assessor has participants assigned
      if (assessor.participants && assessor.participants.length > 0) {
        throw new Error('Cannot delete assessor with assigned participants. Please reassign participants first.');
      }

      const deleted = await assessorRepository.delete(id);
      if (!deleted) {
        throw new Error('Failed to delete assessor');
      }

      return { message: 'Assessor deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete assessor: ${error.message}`);
    }
  }

  async assignParticipantToSelf(assessorId, participantId) {
    try {
      // Check if assessor exists
      const assessor = await assessorRepository.findById(assessorId);
      if (!assessor) {
        throw new Error('Assessor not found');
      }

      // Check if participant exists and is not already assigned
      const participant = await participantRepository.findById(participantId);
      if (!participant) {
        throw new Error('Participant not found');
      }

      if (participant.asesor_id) {
        throw new Error('Participant is already assigned to an assessor');
      }

      const updatedParticipant = await participantRepository.assignAssessor(participantId, assessorId);
      if (!updatedParticipant) {
        throw new Error('Failed to assign participant');
      }

      // Update assessor participant counts
      await assessorRepository.updateParticipantCounts(assessorId);

      return updatedParticipant;
    } catch (error) {
      throw new Error(`Failed to assign participant: ${error.message}`);
    }
  }

  async unassignParticipant(assessorId, participantId) {
    try {
      // Check if participant exists and is assigned to this assessor
      const participant = await participantRepository.findById(participantId);
      if (!participant) {
        throw new Error('Participant not found');
      }

      if (participant.asesor_id !== assessorId) {
        throw new Error('Participant is not assigned to this assessor');
      }

      const updatedParticipant = await participantRepository.assignAssessor(participantId, null);
      if (!updatedParticipant) {
        throw new Error('Failed to unassign participant');
      }

      // Update assessor participant counts
      await assessorRepository.updateParticipantCounts(assessorId);

      return updatedParticipant;
    } catch (error) {
      throw new Error(`Failed to unassign participant: ${error.message}`);
    }
  }

  async getAssessorStatistics(assessorId) {
    try {
      return await assessorRepository.getStatistics(assessorId);
    } catch (error) {
      throw new Error(`Failed to get assessor statistics: ${error.message}`);
    }
  }

  async updateParticipantCounts(assessorId) {
    try {
      return await assessorRepository.updateParticipantCounts(assessorId);
    } catch (error) {
      throw new Error(`Failed to update participant counts: ${error.message}`);
    }
  }
}

module.exports = new AssessorUsecase();
