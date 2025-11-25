'use strict';
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const now = new Date();

    // Generate UUIDs for users
    const adminId = randomUUID();
    const assessor1Id = randomUUID();
    const assessor2Id = randomUUID();
    const assessee1Id = randomUUID();
    const assessee2Id = randomUUID();
    const assessee3Id = randomUUID();

    await queryInterface.bulkInsert('users', [
      {
        id: adminId,
        siagaNumber: 'ADM001',
        email: 'admin@quran.id',
        password: hashedPassword,
        username: 'admin',
        name: 'Admin',
        fullname: 'Administrator System',
        phoneNumber: '081234567890',
        schoolLevels: null,
        levels: null,
        district: 'Jakarta Pusat',
        waLink: null,
        roles: 'Admin',
        createdAt: now,
        updatedAt: now
      },
      {
        id: assessor1Id,
        siagaNumber: 'ASR001',
        email: 'assessor1@quran.id',
        password: hashedPassword,
        username: 'assessor1',
        name: 'Ahmad',
        fullname: 'Ahmad Assessor Pertama',
        phoneNumber: '081234567891',
        schoolLevels: 'SD,SMP,SMA',
        levels: 'Advanced',
        district: 'Jakarta Selatan',
        waLink: 'https://wa.me/6281234567891',
        roles: 'Assessor',
        createdAt: now,
        updatedAt: now
      },
      {
        id: assessor2Id,
        siagaNumber: 'ASR002',
        email: 'assessor2@quran.id',
        password: hashedPassword,
        username: 'assessor2',
        name: 'Fatimah',
        fullname: 'Fatimah Assessor Kedua',
        phoneNumber: '081234567892',
        schoolLevels: 'SD,SMP',
        levels: 'Intermediate',
        district: 'Tangerang',
        waLink: 'https://wa.me/6281234567892',
        roles: 'Assessor',
        createdAt: now,
        updatedAt: now
      },
      {
        id: assessee1Id,
        siagaNumber: 'ASE001',
        email: 'assessee1@quran.id',
        password: hashedPassword,
        username: 'assessee1',
        name: 'Budi',
        fullname: 'Budi Santoso',
        phoneNumber: '081234567893',
        schoolLevels: 'SD',
        levels: 'Beginner',
        district: 'Bekasi',
        waLink: null,
        roles: 'Assessee',
        createdAt: now,
        updatedAt: now
      },
      {
        id: assessee2Id,
        siagaNumber: 'ASE002',
        email: 'assessee2@quran.id',
        password: hashedPassword,
        username: 'assessee2',
        name: 'Siti',
        fullname: 'Siti Aminah',
        phoneNumber: '081234567894',
        schoolLevels: 'SMP',
        levels: 'Intermediate',
        district: 'Depok',
        waLink: null,
        roles: 'Assessee',
        createdAt: now,
        updatedAt: now
      },
      {
        id: assessee3Id,
        siagaNumber: 'ASE003',
        email: 'assessee3@quran.id',
        password: hashedPassword,
        username: 'assessee3',
        name: 'Andi',
        fullname: 'Andi Prasetyo',
        phoneNumber: '081234567895',
        schoolLevels: 'SMA',
        levels: 'Advanced',
        district: 'Bogor',
        waLink: null,
        roles: 'Assessee',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
