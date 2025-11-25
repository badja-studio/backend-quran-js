const { AssesseeGroup, User, CriteriaGroup, Criterion } = require('../models');

class AssesseeGroupRepository {
    /**
     * Assign assessee to criteria group
     * @param {string} assesseeId
     * @param {string} criteriaGroupId
     * @returns {Promise<AssesseeGroup>}
     */
    async assign(assesseeId, criteriaGroupId) {
        // Remove existing assignment first (one assessee can only have one criteria group)
        await AssesseeGroup.destroy({ where: { assesseeId } });
        
        return await AssesseeGroup.create({
            assesseeId,
            criteriaGroupId
        });
    }

    /**
     * Get criteria group for assessee
     * @param {string} assesseeId
     * @returns {Promise<CriteriaGroup|null>}
     */
    async getCriteriaGroupForAssessee(assesseeId) {
        const assignment = await AssesseeGroup.findOne({
            where: { assesseeId },
            include: [{
                model: CriteriaGroup,
                as: 'criteriaGroup',
                include: [{
                    model: Criterion,
                    as: 'criteria'
                }]
            }]
        });
        return assignment ? assignment.criteriaGroup : null;
    }

    /**
     * Remove assessee from criteria group
     * @param {string} assesseeId
     * @returns {Promise<boolean>}
     */
    async remove(assesseeId) {
        const result = await AssesseeGroup.destroy({
            where: { assesseeId }
        });
        return result > 0;
    }
}

module.exports = new AssesseeGroupRepository();
