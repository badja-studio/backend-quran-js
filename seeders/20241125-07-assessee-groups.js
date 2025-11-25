'use strict';
const { randomUUID } = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if relationships already exist
    const existingRelationships = await queryInterface.sequelize.query(
      `SELECT COUNT(*) as count FROM assessee_groups`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingRelationships[0].count > 0) {
      console.log('⏭️  Assessee-Groups relationships already exist, skipping seed...');
      return;
    }

    const now = new Date();

    // Get assessees from database
    const assessees = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE roles = 'Assessee' ORDER BY "createdAt"`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Get criteria groups from database
    const groups = await queryInterface.sequelize.query(
      `SELECT id, name FROM criteria_groups ORDER BY "createdAt"`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const relationships = [];

    // Assign assessees to criteria groups
    assessees.forEach((assessee, index) => {
      // Each assessee gets different criteria groups
      if (index === 0) {
        // Assessee 1: Tajwid and Makharijul Huruf
        const tajwidGroup = groups.find(g => g.name === 'Tajwid');
        const makharijGroup = groups.find(g => g.name === 'Makharijul Huruf');
        
        if (tajwidGroup) {
          relationships.push({
            id: randomUUID(),
            assesseeId: assessee.id,
            criteriaGroupId: tajwidGroup.id,
            createdAt: now,
            updatedAt: now
          });
        }
        
        if (makharijGroup) {
          relationships.push({
            id: randomUUID(),
            assesseeId: assessee.id,
            criteriaGroupId: makharijGroup.id,
            createdAt: now,
            updatedAt: now
          });
        }
      } else if (index === 1) {
        // Assessee 2: All groups
        groups.forEach(group => {
          relationships.push({
            id: randomUUID(),
            assesseeId: assessee.id,
            criteriaGroupId: group.id,
            createdAt: now,
            updatedAt: now
          });
        });
      } else if (index === 2) {
        // Assessee 3: Kelancaran and Hafalan
        const fluencyGroup = groups.find(g => g.name === 'Kelancaran');
        const memorizationGroup = groups.find(g => g.name === 'Hafalan');
        
        if (fluencyGroup) {
          relationships.push({
            id: randomUUID(),
            assesseeId: assessee.id,
            criteriaGroupId: fluencyGroup.id,
            createdAt: now,
            updatedAt: now
          });
        }
        
        if (memorizationGroup) {
          relationships.push({
            id: randomUUID(),
            assesseeId: assessee.id,
            criteriaGroupId: memorizationGroup.id,
            createdAt: now,
            updatedAt: now
          });
        }
      }
    });

    if (relationships.length > 0) {
      await queryInterface.bulkInsert('assessee_groups', relationships, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('assessee_groups', null, {});
  }
};
