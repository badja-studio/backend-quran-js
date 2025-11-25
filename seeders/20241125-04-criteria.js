'use strict';
const { randomUUID } = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if criteria already exist
    const existingCriteria = await queryInterface.sequelize.query(
      `SELECT COUNT(*) as count FROM criteria`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingCriteria[0].count > 0) {
      console.log('⏭️  Criteria already exist, skipping seed...');
      return;
    }

    const now = new Date();

    // First, get the criteria group IDs from the previous seeder
    // We'll use fixed UUIDs that match the previous seeder
    const tajwidId = randomUUID();
    const makharijId = randomUUID();
    const fluencyId = randomUUID();
    const memorizationId = randomUUID();

    // Query to get actual group IDs from database
    const groups = await queryInterface.sequelize.query(
      'SELECT id, name FROM criteria_groups ORDER BY "createdAt"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const groupMap = {};
    groups.forEach(group => {
      groupMap[group.name] = group.id;
    });

    const criteria = [
      // Tajwid criteria
      {
        id: randomUUID(),
        criteriaGroupId: groupMap['Tajwid'],
        name: 'Hukum Nun Mati dan Tanwin',
        description: 'Penerapan hukum nun mati dan tanwin (ikhfa, idgham, iqlab, izhar)',
        maxScore: 100,
        weight: 1.5,
        createdAt: now,
        updatedAt: now
      },
      {
        id: randomUUID(),
        criteriaGroupId: groupMap['Tajwid'],
        name: 'Hukum Mim Mati',
        description: 'Penerapan hukum mim mati (ikhfa syafawi, idgham mimi, izhar syafawi)',
        maxScore: 100,
        weight: 1.0,
        createdAt: now,
        updatedAt: now
      },
      {
        id: randomUUID(),
        criteriaGroupId: groupMap['Tajwid'],
        name: 'Mad (Panjang Pendek)',
        description: 'Ketepatan dalam mad thobi\'i, mad wajib, mad jaiz',
        maxScore: 100,
        weight: 1.5,
        createdAt: now,
        updatedAt: now
      },
      {
        id: randomUUID(),
        criteriaGroupId: groupMap['Tajwid'],
        name: 'Qolqolah',
        description: 'Penerapan qolqolah sughra dan kubra',
        maxScore: 100,
        weight: 1.0,
        createdAt: now,
        updatedAt: now
      },
      // Makharijul Huruf criteria
      {
        id: randomUUID(),
        criteriaGroupId: groupMap['Makharijul Huruf'],
        name: 'Huruf Halqi',
        description: 'Ketepatan makhrij huruf halqi (ء ه ع ح غ خ)',
        maxScore: 100,
        weight: 1.2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: randomUUID(),
        criteriaGroupId: groupMap['Makharijul Huruf'],
        name: 'Huruf Syajari',
        description: 'Ketepatan makhrij huruf syajari (ج ش ي)',
        maxScore: 100,
        weight: 1.0,
        createdAt: now,
        updatedAt: now
      },
      {
        id: randomUUID(),
        criteriaGroupId: groupMap['Makharijul Huruf'],
        name: 'Huruf Litsawi',
        description: 'Ketepatan makhrij huruf litsawi (ظ ذ ث)',
        maxScore: 100,
        weight: 1.0,
        createdAt: now,
        updatedAt: now
      },
      {
        id: randomUUID(),
        criteriaGroupId: groupMap['Makharijul Huruf'],
        name: 'Huruf Nithoi',
        description: 'Ketepatan makhrij huruf nithoi (ط د ت)',
        maxScore: 100,
        weight: 1.0,
        createdAt: now,
        updatedAt: now
      },
      // Kelancaran criteria
      {
        id: randomUUID(),
        criteriaGroupId: groupMap['Kelancaran'],
        name: 'Kecepatan Membaca',
        description: 'Kecepatan dalam membaca dengan tetap menjaga tajwid',
        maxScore: 100,
        weight: 1.0,
        createdAt: now,
        updatedAt: now
      },
      {
        id: randomUUID(),
        criteriaGroupId: groupMap['Kelancaran'],
        name: 'Konsistensi',
        description: 'Konsistensi dalam membaca tanpa banyak kesalahan atau pengulangan',
        maxScore: 100,
        weight: 1.2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: randomUUID(),
        criteriaGroupId: groupMap['Kelancaran'],
        name: 'Waqaf dan Ibtida',
        description: 'Ketepatan dalam menerapkan waqaf dan ibtida',
        maxScore: 100,
        weight: 1.3,
        createdAt: now,
        updatedAt: now
      },
      // Hafalan criteria
      {
        id: randomUUID(),
        criteriaGroupId: groupMap['Hafalan'],
        name: 'Kuantitas Hafalan',
        description: 'Jumlah ayat atau surah yang dihafal',
        maxScore: 100,
        weight: 2.0,
        createdAt: now,
        updatedAt: now
      },
      {
        id: randomUUID(),
        criteriaGroupId: groupMap['Hafalan'],
        name: 'Kualitas Hafalan',
        description: 'Ketepatan hafalan tanpa kesalahan',
        maxScore: 100,
        weight: 2.0,
        createdAt: now,
        updatedAt: now
      },
      {
        id: randomUUID(),
        criteriaGroupId: groupMap['Hafalan'],
        name: 'Kefasihan Hafalan',
        description: 'Kelancaran dalam menyampaikan hafalan',
        maxScore: 100,
        weight: 1.5,
        createdAt: now,
        updatedAt: now
      }
    ];

    await queryInterface.bulkInsert('criteria', criteria, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('criteria', null, {});
  }
};
