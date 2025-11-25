'use strict';
const { randomUUID } = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    // Create schedules for the next 7 days
    const schedules = [];
    const baseDate = new Date('2025-11-25');
    
    for (let i = 0; i < 7; i++) {
      const scheduleDate = new Date(baseDate);
      scheduleDate.setDate(baseDate.getDate() + i);
      
      // Morning session
      schedules.push({
        id: randomUUID(),
        name: `Sesi Pagi - Hari ${i + 1}`,
        date: scheduleDate.toISOString().split('T')[0],
        startTime: '08:00:00',
        endTime: '10:00:00',
        createdAt: now,
        updatedAt: now
      });
      
      // Afternoon session
      schedules.push({
        id: randomUUID(),
        name: `Sesi Siang - Hari ${i + 1}`,
        date: scheduleDate.toISOString().split('T')[0],
        startTime: '13:00:00',
        endTime: '15:00:00',
        createdAt: now,
        updatedAt: now
      });
      
      // Evening session (only on weekdays)
      if (i < 5) {
        schedules.push({
          id: randomUUID(),
          name: `Sesi Sore - Hari ${i + 1}`,
          date: scheduleDate.toISOString().split('T')[0],
          startTime: '16:00:00',
          endTime: '18:00:00',
          createdAt: now,
          updatedAt: now
        });
      }
    }

    await queryInterface.bulkInsert('schedules', schedules, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('schedules', null, {});
  }
};
