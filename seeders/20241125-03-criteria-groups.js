'use strict';
const { randomUUID } = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if criteria groups already exist
    const existingGroups = await queryInterface.sequelize.query(
      `SELECT COUNT(*) as count FROM criteria_groups`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingGroups[0].count > 0) {
      console.log('⏭️  Criteria groups already exist, skipping seed...');
      return;
    }

    const now = new Date();

    const tajwidId = randomUUID();
    const makharijId = randomUUID();
    const fluencyId = randomUUID();
    const memorizationId = randomUUID();

    await queryInterface.bulkInsert('criteria_groups', [
      {
        id: tajwidId,
        name: 'Tajwid',
        description: 'Penilaian kemampuan tajwid dalam membaca Al-Quran',
        createdAt: now,
        updatedAt: now
      },
      {
        id: makharijId,
        name: 'Makharijul Huruf',
        description: 'Penilaian ketepatan makharijul huruf',
        createdAt: now,
        updatedAt: now
      },
      {
        id: fluencyId,
        name: 'Kelancaran',
        description: 'Penilaian kelancaran dalam membaca Al-Quran',
        createdAt: now,
        updatedAt: now
      },
      {
        id: memorizationId,
        name: 'Hafalan',
        description: 'Penilaian hafalan Al-Quran',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('criteria_groups', null, {});
  }
};
