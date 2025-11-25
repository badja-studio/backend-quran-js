'use strict';
const { randomUUID } = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // Get assessors and assessees from database
    const assessors = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE roles = 'Assessor' ORDER BY "createdAt"`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const assessees = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE roles = 'Assessee' ORDER BY "createdAt"`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const relationships = [];

    // Assign each assessee to assessors
    // Assessee 1 -> Assessor 1
    if (assessees[0] && assessors[0]) {
      relationships.push({
        id: randomUUID(),
        assesseeId: assessees[0].id,
        assessorId: assessors[0].id,
        createdAt: now,
        updatedAt: now
      });
    }

    // Assessee 2 -> Assessor 2
    if (assessees[1] && assessors[1]) {
      relationships.push({
        id: randomUUID(),
        assesseeId: assessees[1].id,
        assessorId: assessors[1].id,
        createdAt: now,
        updatedAt: now
      });
    }

    // Assessee 3 -> Both Assessors (untuk contoh multiple assessors)
    if (assessees[2] && assessors[0]) {
      relationships.push({
        id: randomUUID(),
        assesseeId: assessees[2].id,
        assessorId: assessors[0].id,
        createdAt: now,
        updatedAt: now
      });
    }

    if (assessees[2] && assessors[1]) {
      relationships.push({
        id: randomUUID(),
        assesseeId: assessees[2].id,
        assessorId: assessors[1].id,
        createdAt: now,
        updatedAt: now
      });
    }

    if (relationships.length > 0) {
      await queryInterface.bulkInsert('assessee_assessors', relationships, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('assessee_assessors', null, {});
  }
};
