const participantRepository = require('../repository/participant.repository');
const assessorRepository = require('../repository/assessor.repository');
const authRepository = require('../repository/auth.repository');
const { sequelize } = require('../../config/database');

// Validation helpers
const validateEmail = (email) => {
  if (!email) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  if (!phone) return true;
  // Allow digits, spaces, dashes, plus sign, parentheses
  const phoneRegex = /^[+]?[\d\s()-]{8,20}$/;
  return phoneRegex.test(phone);
};

const validateGender = (gender) => {
  return ['L', 'P'].includes(gender);
};

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
      const participant = await participantRepository.findByUserIdWithScores(userId);
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
      // Validate required fields
      const requiredFields = ['no_akun', 'nip', 'nama', 'jenis_kelamin'];
      for (const field of requiredFields) {
        if (!participantData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Validate data types
      if (!validateGender(participantData.jenis_kelamin)) {
        throw new Error('jenis_kelamin must be L (Laki-laki) or P (Perempuan)');
      }

      if (participantData.email && !validateEmail(participantData.email)) {
        throw new Error('Invalid email format');
      }

      if (participantData.no_handphone && !validatePhone(participantData.no_handphone)) {
        throw new Error('Invalid phone number format');
      }

      // OPTIMIZED: Check for duplicates in a single query (3 queries → 1 query)
      const duplicate = await participantRepository.findDuplicates(
        participantData.nip,
        participantData.no_akun,
        null, // email not required for createParticipant
        { transaction }
      );

      if (duplicate) {
        if (duplicate.nip === participantData.nip) {
          throw new Error('Participant with this NIP already exists');
        }
        if (duplicate.no_akun === participantData.no_akun) {
          throw new Error('Participant with this no_akun already exists');
        }
      }

      // Create user account with transaction
      const userData = {
        username: participantData.nip,
        password: participantData.password || participantData.nip, // Use provided password or NIP as default
        role: 'participant'
      };

      const user = await authRepository.createUserWithTransaction(userData, transaction);

      // Remove password from participant data if present
      const { password, ...participantDataClean } = participantData;

      // Create participant with the user account ID
      const participant = await participantRepository.create({
        ...participantDataClean,
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
          password: userData.password
        }
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to create participant: ${error.message}`);
    }
  }

  async registerParticipant(participantData) {
    const transaction = await sequelize.transaction();
    
    try {
      // Validate required fields including password
      const requiredFields = ['nama', 'jenis_kelamin', 'email', 'no_handphone', 'password'];
      for (const field of requiredFields) {
        if (!participantData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Validate data types
      if (!validateGender(participantData.jenis_kelamin)) {
        throw new Error('jenis_kelamin must be L (Laki-laki) or P (Perempuan)');
      }

      if (!validateEmail(participantData.email)) {
        throw new Error('Invalid email format');
      }

      if (!validatePhone(participantData.no_handphone)) {
        throw new Error('Invalid phone number format');
      }

      if (participantData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Generate NIP and no_akun if not provided
      const timestamp = Math.floor(Date.now() / 1000);
      if (!participantData.nip) {
        participantData.nip = `NIP-${timestamp}`;
      }

      if (!participantData.no_akun) {
        participantData.no_akun = `ACC-${timestamp}`;
      }

      // OPTIMIZED: Check for duplicates in a single query (3 queries → 1 query)
      const duplicate = await participantRepository.findDuplicates(
        participantData.nip,
        participantData.no_akun,
        participantData.email,
        { transaction }
      );

      if (duplicate) {
        if (duplicate.nip === participantData.nip) {
          throw new Error('Participant with this NIP already exists');
        }
        if (duplicate.no_akun === participantData.no_akun) {
          throw new Error('Participant with this no_akun already exists');
        }
        if (duplicate.email === participantData.email) {
          throw new Error('Email already registered');
        }
      }

      // Create user account with transaction
      const userData = {
        username: participantData.email,
        password: participantData.password,
        role: 'participant'
      };

      const user = await authRepository.createUserWithTransaction(userData, transaction);

      // Separate participant data from password
      const { password, ...participantDataWithoutPassword } = participantData;

      // Create participant with the user account ID
      const participant = await participantRepository.create({
        ...participantDataWithoutPassword,
        akun_id: user.id,
        status: 'BELUM'
      }, { transaction });

      await transaction.commit();

      // Return participant with user info (without password)
      return {
        ...participant.toJSON(),
        akun: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to register participant: ${error.message}`);
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

  async updateAssessorAndSchedule(participantId, data) {
    try {
      const participant = await participantRepository.findById(participantId);
      if (!participant) {
        throw new Error('Participant not found');
      }

      // Validate assessor if provided
      if (data.asesor_id) {
        const assessor = await assessorRepository.findById(data.asesor_id);
        if (!assessor) {
          throw new Error('Assessor not found');
        }
      }

      const oldAssessorId = participant.asesor_id;

      // Update only assessor and schedule
      const updatedParticipant = await participantRepository.updateAssessorAndSchedule(participantId, {
        asesor_id: data.asesor_id,
        jadwal: data.jadwal
      });

      if (!updatedParticipant) {
        throw new Error('Failed to update participant');
      }

      // Update assessor participant counts if assessor changed
      if (oldAssessorId !== data.asesor_id) {
        if (oldAssessorId) {
          await assessorRepository.updateParticipantCounts(oldAssessorId);
        }
        if (data.asesor_id) {
          await assessorRepository.updateParticipantCounts(data.asesor_id);
        }
      }

      return updatedParticipant;
    } catch (error) {
      throw new Error(`Failed to update assessor and schedule: ${error.message}`);
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
