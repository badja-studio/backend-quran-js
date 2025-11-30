const assessmentRepository = require('../repository/assessment.repository');
const participantRepository = require('../repository/participant.repository');
const assessorRepository = require('../repository/assessor.repository');

class AssessmentUsecase {
  async getAllAssessments(options) {
    try {
      return await assessmentRepository.findAll(options);
    } catch (error) {
      throw new Error(`Failed to get assessments: ${error.message}`);
    }
  }

  async getAssessmentById(id) {
    try {
      const assessment = await assessmentRepository.findById(id);
      if (!assessment) {
        throw new Error('Assessment not found');
      }
      return assessment;
    } catch (error) {
      throw new Error(`Failed to get assessment: ${error.message}`);
    }
  }

  async getAssessmentsByParticipant(participantId, options) {
    try {
      // Check if participant exists
      const participant = await participantRepository.findById(participantId);
      if (!participant) {
        throw new Error('Participant not found');
      }

      return await assessmentRepository.findByParticipant(participantId, options);
    } catch (error) {
      throw new Error(`Failed to get assessments by participant: ${error.message}`);
    }
  }

  async getAssessmentsByAssessor(assessorId, options) {
    try {
      // Check if assessor exists
      const assessor = await assessorRepository.findById(assessorId);
      if (!assessor) {
        throw new Error('Assessor not found');
      }

      return await assessmentRepository.findByAssessor(assessorId, options);
    } catch (error) {
      throw new Error(`Failed to get assessments by assessor: ${error.message}`);
    }
  }

  async createAssessment(assessmentData) {
    try {
      // Validate required fields
      const requiredFields = ['peserta_id', 'asesor_id', 'huruf', 'nilai', 'kategori'];
      for (const field of requiredFields) {
        if (assessmentData[field] === undefined || assessmentData[field] === null) {
          throw new Error(`${field} is required`);
        }
      }

      // Validate nilai: must be >= 0 (boleh 0, tidak boleh minus)
      const nilai = parseFloat(assessmentData.nilai);
      if (isNaN(nilai) || nilai < 0) {
        throw new Error(`nilai must be a number >= 0 (current: ${assessmentData.nilai})`);
      }

      // Check if participant exists
      const participant = await participantRepository.findById(assessmentData.peserta_id);
      if (!participant) {
        throw new Error('Participant not found');
      }

      // Check if assessor exists
      const assessor = await assessorRepository.findById(assessmentData.asesor_id);
      if (!assessor) {
        throw new Error('Assessor not found');
      }

      // Check if participant is assigned to this assessor
      if (participant.asesor_id !== assessmentData.asesor_id) {
        throw new Error('Participant is not assigned to this assessor');
      }

      const assessment = await assessmentRepository.create(assessmentData);
      
      // Update participant status to SUDAH after first assessment
      if (participant.status === 'BELUM') {
        await participantRepository.updateStatus(assessmentData.peserta_id, 'SUDAH');
        // Update assessor participant counts
        await assessorRepository.updateParticipantCounts(assessmentData.asesor_id);
      }

      return assessment;
    } catch (error) {
      throw new Error(`Failed to create assessment: ${error.message}`);
    }
  }

  async createBulkAssessments(assessmentsData) {
    try {
      if (!Array.isArray(assessmentsData) || assessmentsData.length === 0) {
        throw new Error('Assessments data must be a non-empty array');
      }

      // Validate all assessments
      const requiredFields = ['peserta_id', 'asesor_id', 'huruf', 'nilai', 'kategori'];
      for (const assessmentData of assessmentsData) {
        for (const field of requiredFields) {
          if (assessmentData[field] === undefined || assessmentData[field] === null) {
            throw new Error(`${field} is required in all assessments`);
          }
        }
        
        // Validate nilai: must be >= 0 (boleh 0, tidak boleh minus)
        const nilai = parseFloat(assessmentData.nilai);
        if (isNaN(nilai) || nilai < 0) {
          throw new Error(`nilai must be a number >= 0 (current: ${assessmentData.nilai})`);
        }
      }

      // Get unique participant and assessor IDs for validation
      const participantIds = [...new Set(assessmentsData.map(a => a.peserta_id))];
      const assessorIds = [...new Set(assessmentsData.map(a => a.asesor_id))];

      // Validate participants exist
      for (const participantId of participantIds) {
        const participant = await participantRepository.findById(participantId);
        if (!participant) {
          throw new Error(`Participant with ID ${participantId} not found`);
        }
      }

      // Validate assessors exist
      for (const assessorId of assessorIds) {
        const assessor = await assessorRepository.findById(assessorId);
        if (!assessor) {
          throw new Error(`Assessor with ID ${assessorId} not found`);
        }
      }

      // Validate participant-assessor assignments
      for (const assessmentData of assessmentsData) {
        const participant = await participantRepository.findById(assessmentData.peserta_id);
        if (participant.asesor_id !== assessmentData.asesor_id) {
          throw new Error(`Participant ${assessmentData.peserta_id} is not assigned to assessor ${assessmentData.asesor_id}`);
        }
      }

      const assessments = await assessmentRepository.bulkCreate(assessmentsData);

      // Update participant statuses to SUDAH for first-time assessments
      const updatePromises = [];
      for (const participantId of participantIds) {
        const participant = await participantRepository.findById(participantId);
        if (participant.status === 'BELUM') {
          updatePromises.push(participantRepository.updateStatus(participantId, 'SUDAH'));
        }
      }
      await Promise.all(updatePromises);

      // Update assessor participant counts
      const countUpdatePromises = assessorIds.map(assessorId => 
        assessorRepository.updateParticipantCounts(assessorId)
      );
      await Promise.all(countUpdatePromises);

      return assessments;
    } catch (error) {
      throw new Error(`Failed to create bulk assessments: ${error.message}`);
    }
  }

  async updateAssessment(id, assessmentData) {
    try {
      // Validate nilai if provided: must be >= 0 (boleh 0, tidak boleh minus)
      if (assessmentData.nilai !== undefined && assessmentData.nilai !== null) {
        const nilai = parseFloat(assessmentData.nilai);
        if (isNaN(nilai) || nilai < 0) {
          throw new Error(`nilai must be a number >= 0 (current: ${assessmentData.nilai})`);
        }
      }

      const assessment = await assessmentRepository.update(id, assessmentData);
      if (!assessment) {
        throw new Error('Assessment not found');
      }
      return assessment;
    } catch (error) {
      throw new Error(`Failed to update assessment: ${error.message}`);
    }
  }

  async deleteAssessment(id) {
    try {
      const assessment = await assessmentRepository.findById(id);
      if (!assessment) {
        throw new Error('Assessment not found');
      }

      const deleted = await assessmentRepository.delete(id);
      if (!deleted) {
        throw new Error('Failed to delete assessment');
      }

      // Check if participant has any remaining assessments
      const remainingAssessments = await assessmentRepository.findByParticipant(assessment.peserta_id);
      if (remainingAssessments.data.length === 0) {
        // Update participant status back to BELUM if no assessments remain
        await participantRepository.updateStatus(assessment.peserta_id, 'BELUM');
        // Update assessor participant counts
        await assessorRepository.updateParticipantCounts(assessment.asesor_id);
      }

      return { message: 'Assessment deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete assessment: ${error.message}`);
    }
  }

  async deleteAssessmentsByParticipantAndAssessor(participantId, assessorId) {
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

      const deleted = await assessmentRepository.deleteByParticipantAndAssessor(participantId, assessorId);

      // Update participant status to BELUM if all assessments deleted
      const remainingAssessments = await assessmentRepository.findByParticipant(participantId);
      if (remainingAssessments.data.length === 0) {
        await participantRepository.updateStatus(participantId, 'BELUM');
      }

      // Update assessor participant counts
      await assessorRepository.updateParticipantCounts(assessorId);

      return { message: `${deleted} assessments deleted successfully` };
    } catch (error) {
      throw new Error(`Failed to delete assessments: ${error.message}`);
    }
  }

  async getParticipantAssessmentSummary(participantId) {
    try {
      // Check if participant exists
      const participant = await participantRepository.findById(participantId);
      if (!participant) {
        throw new Error('Participant not found');
      }

      return await assessmentRepository.getParticipantSummary(participantId);
    } catch (error) {
      throw new Error(`Failed to get participant assessment summary: ${error.message}`);
    }
  }

  async getAssessorAssessmentSummary(assessorId) {
    try {
      // Check if assessor exists
      const assessor = await assessorRepository.findById(assessorId);
      if (!assessor) {
        throw new Error('Assessor not found');
      }

      return await assessmentRepository.getAssessorSummary(assessorId);
    } catch (error) {
      throw new Error(`Failed to get assessor assessment summary: ${error.message}`);
    }
  }
}

module.exports = new AssessmentUsecase();
