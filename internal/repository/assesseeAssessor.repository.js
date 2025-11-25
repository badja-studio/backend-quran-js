const { AssesseeAssessor, User } = require('../models');

class AssesseeAssessorRepository {
    /**
     * Assign assessor to assessee
     * @param {string} assesseeId
     * @param {string} assessorId
     * @returns {Promise<AssesseeAssessor>}
     */
    async assign(assesseeId, assessorId) {
        const [relation, created] = await AssesseeAssessor.findOrCreate({
            where: { assesseeId, assessorId }
        });
        return relation;
    }

    /**
     * Remove assessor from assessee
     * @param {string} assesseeId
     * @param {string} assessorId
     * @returns {Promise<boolean>}
     */
    async remove(assesseeId, assessorId) {
        const result = await AssesseeAssessor.destroy({
            where: { assesseeId, assessorId }
        });
        return result > 0;
    }

    /**
     * Get all assessors for an assessee
     * @param {string} assesseeId
     * @returns {Promise<User[]>}
     */
    async getAssessorsForAssessee(assesseeId) {
        const relations = await AssesseeAssessor.findAll({
            where: { assesseeId },
            include: [{
                model: User,
                as: 'assessor',
                attributes: ['id', 'name', 'fullname', 'email', 'waLink']
            }]
        });
        return relations.map(r => r.assessor);
    }

    /**
     * Get all assessees for an assessor
     * @param {string} assessorId
     * @returns {Promise<User[]>}
     */
    async getAssesseesForAssessor(assessorId) {
        const relations = await AssesseeAssessor.findAll({
            where: { assessorId },
            include: [{
                model: User,
                as: 'assessee',
                attributes: ['id', 'name', 'fullname', 'siagaNumber', 'email', 'schoolLevels', 'levels', 'district']
            }]
        });
        return relations.map(r => r.assessee);
    }
}

module.exports = new AssesseeAssessorRepository();
