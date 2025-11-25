const { CriteriaGroup, Criterion } = require('../models');

class CriteriaGroupRepository {
    /**
     * Create a new criteria group
     * @param {Object} groupData - Criteria group data
     * @returns {Promise<CriteriaGroup>}
     */
    async create(groupData) {
        return await CriteriaGroup.create(groupData);
    }

    /**
     * Find all criteria groups
     * @returns {Promise<CriteriaGroup[]>}
     */
    async findAll() {
        return await CriteriaGroup.findAll({
            include: [{
                model: Criterion,
                as: 'criteria'
            }]
        });
    }

    /**
     * Find criteria group by ID
     * @param {string} id
     * @returns {Promise<CriteriaGroup|null>}
     */
    async findById(id) {
        return await CriteriaGroup.findByPk(id, {
            include: [{
                model: Criterion,
                as: 'criteria'
            }]
        });
    }

    /**
     * Update criteria group
     * @param {string} id
     * @param {Object} groupData
     * @returns {Promise<CriteriaGroup|null>}
     */
    async update(id, groupData) {
        const group = await CriteriaGroup.findByPk(id);
        if (!group) return null;
        return await group.update(groupData);
    }

    /**
     * Delete criteria group
     * @param {string} id
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        const group = await CriteriaGroup.findByPk(id);
        if (!group) return false;
        await group.destroy();
        return true;
    }
}

module.exports = new CriteriaGroupRepository();
