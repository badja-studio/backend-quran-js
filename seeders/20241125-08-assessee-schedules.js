'use strict';
const { randomUUID } = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // Get assessees from database
    const assessees = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE roles = 'Assessee' ORDER BY "createdAt"`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Get schedules from database
    const schedules = await queryInterface.sequelize.query(
      `SELECT id FROM schedules ORDER BY date, "startTime" LIMIT 10`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const relationships = [];

    // Assign assessees to schedules
    assessees.forEach((assessee, assesseeIndex) => {
      // Each assessee gets 2-3 schedules
      const numberOfSchedules = assesseeIndex === 1 ? 3 : 2;
      const startIndex = assesseeIndex * 2;
      
      for (let i = 0; i < numberOfSchedules && (startIndex + i) < schedules.length; i++) {
        relationships.push({
          id: randomUUID(),
          assesseeId: assessee.id,
          scheduleId: schedules[startIndex + i].id,
          createdAt: now,
          updatedAt: now
        });
      }
    });

    if (relationships.length > 0) {
      await queryInterface.bulkInsert('assessee_schedules', relationships, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('assessee_schedules', null, {});
  }
};
