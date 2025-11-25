const { Criterion, CriteriaGroup } = require('../models');

class CriterionRepository {
    /**
     * Create a new criterion
     * @param {Object} criterionData - Criterion data
     * @returns {Promise<Criterion>}
     */
    async create(criterionData) {
        return await Criterion.create(criterionData);
    }

    /**
     * Find criterion by ID
     * @param {string} id
     * @returns {Promise<Criterion|null>}
     */
    async findById(id) {
        return await Criterion.findByPk(id, {
            include: [{
                model: CriteriaGroup,
                as: 'criteriaGroup'
            }]
        });
    }

    /**
     * Find criteria by group ID
     * @param {string} criteriaGroupId
     * @returns {Promise<Criterion[]>}
     */
    async findByGroupId(criteriaGroupId) {
        return await Criterion.findAll({
            where: { criteriaGroupId }
        });
    }

    /**
     * Update criterion
     * @param {string} id
     * @param {Object} criterionData
     * @returns {Promise<Criterion|null>}
     */
    async update(id, criterionData) {
        const criterion = await Criterion.findByPk(id);
        if (!criterion) return null;
        return await criterion.update(criterionData);
    }

    /**
     * Delete criterion
     * @param {string} id
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        const criterion = await Criterion.findByPk(id);
        if (!criterion) return false;
        await criterion.destroy();
        return true;
    }
}

module.exports = new CriterionRepository();
