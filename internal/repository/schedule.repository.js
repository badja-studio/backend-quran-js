const { Schedule, User, AssesseeSchedule } = require('../models');

class ScheduleRepository {
    /**
     * Create a new schedule
     * @param {Object} scheduleData - Schedule data
     * @returns {Promise<Schedule>}
     */
    async create(scheduleData) {
        return await Schedule.create(scheduleData);
    }

    /**
     * Find all schedules
     * @returns {Promise<Schedule[]>}
     */
    async findAll() {
        return await Schedule.findAll({
            include: [{
                model: User,
                as: 'assessees',
                attributes: ['id', 'name', 'fullname', 'siagaNumber'],
                through: { attributes: [] }
            }]
        });
    }

    /**
     * Find schedule by ID
     * @param {string} id
     * @returns {Promise<Schedule|null>}
     */
    async findById(id) {
        return await Schedule.findByPk(id, {
            include: [{
                model: User,
                as: 'assessees',
                attributes: ['id', 'name', 'fullname', 'siagaNumber', 'email'],
                through: { attributes: [] }
            }]
        });
    }

    /**
     * Update schedule
     * @param {string} id
     * @param {Object} scheduleData
     * @returns {Promise<Schedule|null>}
     */
    async update(id, scheduleData) {
        const schedule = await Schedule.findByPk(id);
        if (!schedule) return null;
        return await schedule.update(scheduleData);
    }

    /**
     * Delete schedule
     * @param {string} id
     * @returns {Promise<boolean>}
     */
    async delete(id) {
        const schedule = await Schedule.findByPk(id);
        if (!schedule) return false;
        await schedule.destroy();
        return true;
    }

    /**
     * Add assessees to schedule
     * @param {string} scheduleId
     * @param {string[]} assesseeIds
     * @returns {Promise<void>}
     */
    async addAssessees(scheduleId, assesseeIds) {
        const schedule = await Schedule.findByPk(scheduleId);
        if (!schedule) throw new Error('Schedule not found');

        for (const assesseeId of assesseeIds) {
            await AssesseeSchedule.findOrCreate({
                where: { scheduleId, assesseeId }
            });
        }
    }

    /**
     * Remove assessee from schedule
     * @param {string} scheduleId
     * @param {string} assesseeId
     * @returns {Promise<boolean>}
     */
    async removeAssessee(scheduleId, assesseeId) {
        const result = await AssesseeSchedule.destroy({
            where: { scheduleId, assesseeId }
        });
        return result > 0;
    }
}

module.exports = new ScheduleRepository();
