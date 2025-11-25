'use strict';
const { randomUUID } = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if assessments already exist
    const existingAssessments = await queryInterface.sequelize.query(
      `SELECT COUNT(*) as count FROM assessments`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingAssessments[0].count > 0) {
      console.log('⏭️  Assessments already exist, skipping seed...');
      return;
    }

    const now = new Date();

    // Get assessees and assessors
    const assessees = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE roles = 'Assessee' ORDER BY "createdAt"`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const assessors = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE roles = 'Assessor' ORDER BY "createdAt"`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Get criteria
    const criteria = await queryInterface.sequelize.query(
      `SELECT c.id, c.name, cg.name as groupName 
       FROM criteria c 
       JOIN criteria_groups cg ON c."criteriaGroupId" = cg.id 
       ORDER BY cg."createdAt", c."createdAt"`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const assessments = [];

    // Create sample assessments
    // Assessee 1 assessed by Assessor 1 on Tajwid criteria
    if (assessees[0] && assessors[0]) {
      const tajwidCriteria = criteria.filter(c => c.groupName === 'Tajwid');
      tajwidCriteria.forEach((criterion, index) => {
        assessments.push({
          id: randomUUID(),
          assesseeId: assessees[0].id,
          assessorId: assessors[0].id,
          criterionId: criterion.id,
          score: 75 + (index * 5), // Scores: 75, 80, 85, 90
          notes: `Penilaian ${criterion.name} untuk assessee pertama. Sudah cukup baik, perlu peningkatan di beberapa aspek.`,
          createdAt: now,
          updatedAt: now
        });
      });

      // Makharijul Huruf criteria
      const makharijCriteria = criteria.filter(c => c.groupName === 'Makharijul Huruf');
      makharijCriteria.slice(0, 2).forEach((criterion, index) => {
        assessments.push({
          id: randomUUID(),
          assesseeId: assessees[0].id,
          assessorId: assessors[0].id,
          criterionId: criterion.id,
          score: 80 + (index * 3),
          notes: `Penilaian ${criterion.name}. Makhrij sudah cukup tepat.`,
          createdAt: now,
          updatedAt: now
        });
      });
    }

    // Assessee 2 assessed by Assessor 2 on various criteria
    if (assessees[1] && assessors[1]) {
      const fluencyCriteria = criteria.filter(c => c.groupName === 'Kelancaran');
      fluencyCriteria.forEach((criterion, index) => {
        assessments.push({
          id: randomUUID(),
          assesseeId: assessees[1].id,
          assessorId: assessors[1].id,
          criterionId: criterion.id,
          score: 85 + (index * 2),
          notes: `Kelancaran ${criterion.name} sangat baik. Terus pertahankan.`,
          createdAt: now,
          updatedAt: now
        });
      });
    }

    // Assessee 3 assessed by both assessors
    if (assessees[2] && assessors[0]) {
      const hafalanCriteria = criteria.filter(c => c.groupName === 'Hafalan');
      hafalanCriteria.forEach((criterion, index) => {
        assessments.push({
          id: randomUUID(),
          assesseeId: assessees[2].id,
          assessorId: assessors[0].id,
          criterionId: criterion.id,
          score: 90 + (index * 2),
          notes: `Hafalan ${criterion.name} sangat bagus. Mashaa Allah!`,
          createdAt: now,
          updatedAt: now
        });
      });
    }

    if (assessments.length > 0) {
      await queryInterface.bulkInsert('assessments', assessments, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('assessments', null, {});
  }
};
