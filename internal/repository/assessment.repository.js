const { Assessment, User, Criterion, CriteriaGroup } = require('../models');
const { Op } = require('sequelize');

class AssessmentRepository {
    /**
     * Create or update assessment
     * @param {Object} assessmentData - { assesseeId, assessorId, criterionId, score, notes }
     * @returns {Promise<Assessment>}
     */
    async createOrUpdate(assessmentData) {
        const { assesseeId, assessorId, criterionId, score, notes } = assessmentData;

        const [assessment, created] = await Assessment.findOrCreate({
            where: { assesseeId, assessorId, criterionId },
            defaults: { score, notes }
        });

        if (!created) {
            await assessment.update({ score, notes });
        }

        return assessment;
    }

    /**
     * Find assessment by ID
     * @param {string} id
     * @returns {Promise<Assessment|null>}
     */
    async findById(id) {
        return await Assessment.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'assessee',
                    attributes: ['id', 'name', 'fullname', 'siagaNumber']
                },
                {
                    model: User,
                    as: 'assessor',
                    attributes: ['id', 'name', 'fullname']
                },
                {
                    model: Criterion,
                    as: 'criterion'
                }
            ]
        });
    }

    /**
     * Get all assessments for an assessee
     * @param {string} assesseeId
     * @returns {Promise<Assessment[]>}
     */
    async getAssessmentsForAssessee(assesseeId) {
        return await Assessment.findAll({
            where: { assesseeId },
            include: [
                {
                    model: User,
                    as: 'assessor',
                    attributes: ['id', 'name', 'fullname']
                },
                {
                    model: Criterion,
                    as: 'criterion',
                    include: [{
                        model: CriteriaGroup,
                        as: 'criteriaGroup'
                    }]
                }
            ]
        });
    }

    /**
     * Get all assessments given by an assessor
     * @param {string} assessorId
     * @returns {Promise<Assessment[]>}
     */
    async getAssessmentsByAssessor(assessorId) {
        return await Assessment.findAll({
            where: { assessorId },
            include: [
                {
                    model: User,
                    as: 'assessee',
                    attributes: ['id', 'name', 'fullname', 'siagaNumber']
                },
                {
                    model: Criterion,
                    as: 'criterion'
                }
            ]
        });
    }

    /**
     * Get assessment for specific assessee, assessor, criterion combination
     * @param {string} assesseeId
     * @param {string} assessorId
     * @param {string} criterionId
     * @returns {Promise<Assessment|null>}
     */
    async findByCompositeKey(assesseeId, assessorId, criterionId) {
        return await Assessment.findOne({
            where: { assesseeId, assessorId, criterionId }
        });
    }

    /**
     * Delete assessment
     * @param {string} id
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        const assessment = await Assessment.findByPk(id);
        if (!assessment) return false;
        await assessment.destroy();
        return true;
    }

    /**
     * Batch create/update assessments
     * @param {string} assesseeId
     * @param {string} assessorId
     * @param {Object[]} assessments - Array of { criterionId, score, notes }
     * @returns {Promise<Assessment[]>}
     */
    async batchCreateOrUpdate(assesseeId, assessorId, assessments) {
        const results = [];
        
        for (const item of assessments) {
            const assessment = await this.createOrUpdate({
                assesseeId,
                assessorId,
                criterionId: item.criterionId,
                score: item.score,
                notes: item.notes
            });
            results.push(assessment);
        }

        return results;
    }
}

module.exports = new AssessmentRepository();
