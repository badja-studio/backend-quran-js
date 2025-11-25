const assesseeAssessorRepo = require('../repository/assesseeAssessor.repository');
const assessmentRepo = require('../repository/assessment.repository');
const criterionRepo = require('../repository/criterion.repository');

class AssessorUseCase {
    /**
     * Get all assessees assigned to this assessor
     */
    async getMyAssessees(assessorId) {
        try {
            const assessees = await assesseeAssessorRepo.getAssesseesForAssessor(assessorId);

            return {
                success: true,
                data: assessees
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get assessee detail with criteria
     */
    async getAssesseeDetail(assessorId, assesseeId) {
        try {
            const { User } = require('../models');
            const assesseeGroupRepo = require('../repository/assesseeGroup.repository');

            // Verify this assessor is assigned to this assessee
            const assessees = await assesseeAssessorRepo.getAssesseesForAssessor(assessorId);
            const isAssigned = assessees.some(a => a.id === assesseeId);

            if (!isAssigned) {
                throw new Error('You are not assigned to this assessee');
            }

            // Get assessee info
            const assessee = await User.findByPk(assesseeId, {
                attributes: { exclude: ['password'] }
            });

            // Get criteria group with criteria
            const criteriaGroup = await assesseeGroupRepo.getCriteriaGroupForAssessee(assesseeId);

            if (!criteriaGroup) {
                throw new Error('No criteria group assigned to this assessee');
            }

            // Get existing assessments from this assessor
            const existingAssessments = await assessmentRepo.getAssessmentsByAssessor(assessorId);
            const assesseeAssessments = existingAssessments.filter(a => a.assesseeId === assesseeId);

            return {
                success: true,
                data: {
                    assessee,
                    criteriaGroup,
                    existingAssessments: assesseeAssessments
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Submit assessments for an assessee
     */
    async submitAssessments(assessorId, assesseeId, assessments) {
        try {
            const assesseeGroupRepo = require('../repository/assesseeGroup.repository');

            // Verify this assessor is assigned to this assessee
            const assessees = await assesseeAssessorRepo.getAssesseesForAssessor(assessorId);
            const isAssigned = assessees.some(a => a.id === assesseeId);

            if (!isAssigned) {
                throw new Error('You are not assigned to this assessee');
            }

            // Verify all criteria belong to the assessee's criteria group
            const criteriaGroup = await assesseeGroupRepo.getCriteriaGroupForAssessee(assesseeId);
            if (!criteriaGroup) {
                throw new Error('No criteria group assigned to this assessee');
            }

            const validCriteriaIds = criteriaGroup.criteria.map(c => c.id);

            for (const item of assessments) {
                if (!validCriteriaIds.includes(item.criterionId)) {
                    throw new Error(`Invalid criterion ID: ${item.criterionId}`);
                }

                // Verify score is within max score
                const criterion = criteriaGroup.criteria.find(c => c.id === item.criterionId);
                if (item.score > criterion.maxScore || item.score < 0) {
                    throw new Error(`Score must be between 0 and ${criterion.maxScore}`);
                }
            }

            // Batch create/update assessments
            const results = await assessmentRepo.batchCreateOrUpdate(
                assesseeId,
                assessorId,
                assessments
            );

            return {
                success: true,
                message: 'Assessments submitted successfully',
                data: results
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Update a specific assessment
     */
    async updateAssessment(assessorId, assessmentId, data) {
        try {
            const assessment = await assessmentRepo.findById(assessmentId);

            if (!assessment) {
                throw new Error('Assessment not found');
            }

            if (assessment.assessorId !== assessorId) {
                throw new Error('You can only update your own assessments');
            }

            const { score, notes } = data;

            // Verify score is within max score
            if (score !== undefined) {
                const criterion = assessment.criterion;
                if (score > criterion.maxScore || score < 0) {
                    throw new Error(`Score must be between 0 and ${criterion.maxScore}`);
                }
            }

            const updated = await assessmentRepo.createOrUpdate({
                assesseeId: assessment.assesseeId,
                assessorId: assessment.assessorId,
                criterionId: assessment.criterionId,
                score: score !== undefined ? score : assessment.score,
                notes: notes !== undefined ? notes : assessment.notes
            });

            return {
                success: true,
                message: 'Assessment updated successfully',
                data: updated
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get all assessments given by this assessor
     */
    async getMyAssessments(assessorId) {
        try {
            const assessments = await assessmentRepo.getAssessmentsByAssessor(assessorId);

            return {
                success: true,
                data: assessments
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

module.exports = new AssessorUseCase();
