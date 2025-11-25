const assessmentRepo = require('../repository/assessment.repository');
const assesseeGroupRepo = require('../repository/assesseeGroup.repository');
const { User, Schedule, AssesseeSchedule } = require('../models');

class AssesseeUseCase {
    /**
     * Get assessee profile
     */
    async getProfile(assesseeId) {
        try {
            const assessee = await User.findByPk(assesseeId, {
                attributes: { exclude: ['password'] }
            });

            if (!assessee || assessee.roles !== 'Assessee') {
                throw new Error('Assessee not found');
            }

            return {
                success: true,
                data: assessee
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get all assessments received by this assessee
     */
    async getMyAssessments(assesseeId) {
        try {
            const assessments = await assessmentRepo.getAssessmentsForAssessee(assesseeId);

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

    /**
     * Get assessment summary with averages
     */
    async getAssessmentSummary(assesseeId) {
        try {
            const assesseeAssessorRepo = require('../repository/assesseeAssessor.repository');

            // Get criteria group
            const criteriaGroup = await assesseeGroupRepo.getCriteriaGroupForAssessee(assesseeId);

            if (!criteriaGroup) {
                return {
                    success: true,
                    data: {
                        criteriaGroup: null,
                        message: 'No criteria group assigned yet'
                    }
                };
            }

            // Get assessors
            const assessors = await assesseeAssessorRepo.getAssessorsForAssessee(assesseeId);

            // Get all assessments
            const assessments = await assessmentRepo.getAssessmentsForAssessee(assesseeId);

            // Group assessments by criterion
            const criteriaMap = new Map();
            
            criteriaGroup.criteria.forEach(criterion => {
                criteriaMap.set(criterion.id, {
                    criterion: {
                        id: criterion.id,
                        name: criterion.name,
                        description: criterion.description,
                        maxScore: criterion.maxScore,
                        weight: criterion.weight
                    },
                    scores: [],
                    average: 0
                });
            });

            // Fill in scores
            assessments.forEach(assessment => {
                const criterionData = criteriaMap.get(assessment.criterionId);
                if (criterionData) {
                    criterionData.scores.push({
                        assessor: {
                            id: assessment.assessor.id,
                            name: assessment.assessor.name,
                            fullname: assessment.assessor.fullname
                        },
                        score: parseFloat(assessment.score),
                        notes: assessment.notes
                    });
                }
            });

            // Calculate averages
            const summaryByCriterion = [];
            let totalWeightedScore = 0;
            let totalWeight = 0;

            criteriaMap.forEach(criterionData => {
                if (criterionData.scores.length > 0) {
                    const sum = criterionData.scores.reduce((acc, s) => acc + s.score, 0);
                    criterionData.average = sum / criterionData.scores.length;
                }

                summaryByCriterion.push(criterionData);

                // Calculate weighted score
                if (criterionData.scores.length > 0) {
                    const weight = parseFloat(criterionData.criterion.weight);
                    totalWeightedScore += criterionData.average * weight;
                    totalWeight += weight;
                }
            });

            const overallAverage = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

            return {
                success: true,
                data: {
                    criteriaGroup: {
                        id: criteriaGroup.id,
                        name: criteriaGroup.name,
                        description: criteriaGroup.description
                    },
                    assessors,
                    assessments: summaryByCriterion,
                    overallAverage: Math.round(overallAverage * 100) / 100
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
     * Get assessee schedule
     */
    async getMySchedule(assesseeId) {
        try {
            const schedules = await Schedule.findAll({
                include: [{
                    model: User,
                    as: 'assessees',
                    where: { id: assesseeId },
                    attributes: [],
                    through: { attributes: [] }
                }]
            });

            return {
                success: true,
                data: schedules
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

module.exports = new AssesseeUseCase();
