'use strict';
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const now = new Date();

    // Get existing assessor and criteria group IDs
    const assessors = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE roles = 'Assessor' LIMIT 2`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const criteriaGroups = await queryInterface.sequelize.query(
      `SELECT id FROM criteria_groups LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const criteria = await queryInterface.sequelize.query(
      `SELECT id FROM criteria LIMIT 3`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (assessors.length === 0 || criteriaGroups.length === 0 || criteria.length === 0) {
      console.log('⚠️  Required data not found. Please run base seeders first.');
      return;
    }

    const assessorId1 = assessors[0].id;
    const assessorId2 = assessors[1]?.id || assessorId1;
    const criteriaGroupId = criteriaGroups[0].id;

    // Generate 15 assessee IDs
    const assesseeIds = Array.from({ length: 15 }, () => randomUUID());

    // Data template untuk assessee
    const assesseeData = [
      // Grup 1: BELUM ASESMEN (5 assessee) - Tidak punya assessor, group, atau assessment
      {
        id: assesseeIds[0],
        siagaNumber: 'TST001',
        accountNumber: 'A001',
        nip: '1987654321',
        email: 'budi.santoso@test.id',
        username: 'budi.santoso',
        name: 'Budi',
        fullname: 'Budi Santoso',
        gender: 'L',
        birthPlace: 'Jakarta',
        position: 'Guru',
        phoneNumber: '081234560001',
        province: 'DKI Jakarta',
        schoolLevels: 'SMA',
        schoolName: 'SMA Negeri 8 Jakarta',
        levels: 'Senior',
        district: 'Jakarta Selatan',
        education: 'S1',
        studyProgram: 'Pendidikan Matematika',
        university: 'UNJ',
        universityType: 'Negeri',
        graduationYear: '2018',
        roles: 'Assessee'
      },
      {
        id: assesseeIds[1],
        siagaNumber: 'TST002',
        accountNumber: 'A002',
        nip: '1987654322',
        email: 'siti.rahma@test.id',
        username: 'siti.rahma',
        name: 'Siti',
        fullname: 'Siti Rahma',
        gender: 'P',
        birthPlace: 'Bandung',
        position: 'Staf TU',
        phoneNumber: '081234560002',
        province: 'Jawa Barat',
        schoolLevels: 'SMP',
        schoolName: 'SMP Negeri 3 Bandung',
        levels: 'Junior',
        district: 'Bandung',
        education: 'D3',
        studyProgram: 'Administrasi Perkantoran',
        university: 'Polban',
        universityType: 'Negeri',
        graduationYear: '2016',
        roles: 'Assessee'
      },
      {
        id: assesseeIds[2],
        siagaNumber: 'TST003',
        accountNumber: 'A003',
        nip: '1987654323',
        email: 'agus.kurniawan@test.id',
        username: 'agus.kurniawan',
        name: 'Agus',
        fullname: 'Agus Kurniawan',
        gender: 'L',
        birthPlace: 'Surabaya',
        position: 'Guru',
        phoneNumber: '081234560003',
        province: 'Jawa Timur',
        schoolLevels: 'SD',
        schoolName: 'SDN 01 Ketintang',
        levels: 'Middle',
        district: 'Surabaya',
        education: 'S1',
        studyProgram: 'PGSD',
        university: 'UNESA',
        universityType: 'Negeri',
        graduationYear: '2019',
        roles: 'Assessee'
      },
      {
        id: assesseeIds[3],
        siagaNumber: 'TST004',
        accountNumber: 'A004',
        nip: '1987654324',
        email: 'nur.aisyah@test.id',
        username: 'nur.aisyah',
        name: 'Nur',
        fullname: 'Nur Aisyah',
        gender: 'P',
        birthPlace: 'Medan',
        position: 'Guru',
        phoneNumber: '081234560004',
        province: 'Sumatera Utara',
        schoolLevels: 'SMA',
        schoolName: 'SMA Negeri 5 Medan',
        levels: 'Junior',
        district: 'Medan',
        education: 'S2',
        studyProgram: 'Pendidikan Bahasa Indonesia',
        university: 'UNIMED',
        universityType: 'Negeri',
        graduationYear: '2020',
        roles: 'Assessee'
      },
      {
        id: assesseeIds[4],
        siagaNumber: 'TST005',
        accountNumber: 'A005',
        nip: '1987654325',
        email: 'rizky.pratama@test.id',
        username: 'rizky.pratama',
        name: 'Rizky',
        fullname: 'Rizky Pratama',
        gender: 'L',
        birthPlace: 'Yogyakarta',
        position: 'Staf IT',
        phoneNumber: '081234560005',
        province: 'DI Yogyakarta',
        schoolLevels: 'SMP',
        schoolName: 'SMP Muhammadiyah 4',
        levels: 'Middle',
        district: 'Yogyakarta',
        education: 'S1',
        studyProgram: 'Teknik Informatika',
        university: 'UGM',
        universityType: 'Negeri',
        graduationYear: '2021',
        roles: 'Assessee'
      },
      
      // Grup 2: SIAP ASESMEN (5 assessee) - Punya assessor DAN criteria group tapi BELUM ada assessment
      {
        id: assesseeIds[5],
        siagaNumber: 'TST006',
        accountNumber: 'A006',
        nip: '1987654326',
        email: 'dewi.sartika@test.id',
        username: 'dewi.sartika',
        name: 'Dewi',
        fullname: 'Dewi Sartika',
        gender: 'P',
        birthPlace: 'Semarang',
        position: 'Guru',
        phoneNumber: '081234560006',
        province: 'Jawa Tengah',
        schoolLevels: 'SMA',
        schoolName: 'SMA Negeri 1 Semarang',
        levels: 'Senior',
        district: 'Semarang',
        education: 'S1',
        studyProgram: 'Pendidikan Fisika',
        university: 'UNNES',
        universityType: 'Negeri',
        graduationYear: '2017',
        roles: 'Assessee'
      },
      {
        id: assesseeIds[6],
        siagaNumber: 'TST007',
        accountNumber: 'A007',
        nip: '1987654327',
        email: 'imam.syafi@test.id',
        username: 'imam.syafi',
        name: 'Imam',
        fullname: 'Imam Syafii',
        gender: 'L',
        birthPlace: 'Malang',
        position: 'Guru',
        phoneNumber: '081234560007',
        province: 'Jawa Timur',
        schoolLevels: 'SMP',
        schoolName: 'SMP Negeri 2 Malang',
        levels: 'Middle',
        district: 'Malang',
        education: 'S1',
        studyProgram: 'Pendidikan Agama Islam',
        university: 'UIN Malang',
        universityType: 'Negeri',
        graduationYear: '2019',
        roles: 'Assessee'
      },
      {
        id: assesseeIds[7],
        siagaNumber: 'TST008',
        accountNumber: 'A008',
        nip: '1987654328',
        email: 'linda.wijaya@test.id',
        username: 'linda.wijaya',
        name: 'Linda',
        fullname: 'Linda Wijaya',
        gender: 'P',
        birthPlace: 'Palembang',
        position: 'Guru',
        phoneNumber: '081234560008',
        province: 'Sumatera Selatan',
        schoolLevels: 'SD',
        schoolName: 'SDN 5 Palembang',
        levels: 'Junior',
        district: 'Palembang',
        education: 'S1',
        studyProgram: 'PGSD',
        university: 'UNSRI',
        universityType: 'Negeri',
        graduationYear: '2020',
        roles: 'Assessee'
      },
      {
        id: assesseeIds[8],
        siagaNumber: 'TST009',
        accountNumber: 'A009',
        nip: '1987654329',
        email: 'hendra.gunawan@test.id',
        username: 'hendra.gunawan',
        name: 'Hendra',
        fullname: 'Hendra Gunawan',
        gender: 'L',
        birthPlace: 'Makassar',
        position: 'Guru',
        phoneNumber: '081234560009',
        province: 'Sulawesi Selatan',
        schoolLevels: 'SMA',
        schoolName: 'SMA Negeri 3 Makassar',
        levels: 'Senior',
        district: 'Makassar',
        education: 'S2',
        studyProgram: 'Pendidikan Kimia',
        university: 'UNM',
        universityType: 'Negeri',
        graduationYear: '2018',
        roles: 'Assessee'
      },
      {
        id: assesseeIds[9],
        siagaNumber: 'TST010',
        accountNumber: 'A010',
        nip: '1987654330',
        email: 'maria.ulfa@test.id',
        username: 'maria.ulfa',
        name: 'Maria',
        fullname: 'Maria Ulfa',
        gender: 'P',
        birthPlace: 'Denpasar',
        position: 'Staf Perpustakaan',
        phoneNumber: '081234560010',
        province: 'Bali',
        schoolLevels: 'SMP',
        schoolName: 'SMP Negeri 1 Denpasar',
        levels: 'Middle',
        district: 'Denpasar',
        education: 'D3',
        studyProgram: 'Perpustakaan',
        university: 'Universitas Udayana',
        universityType: 'Negeri',
        graduationYear: '2019',
        roles: 'Assessee'
      },

      // Grup 3: DENGAN HASIL (5 assessee) - Sudah punya assessor, criteria group, DAN assessment
      {
        id: assesseeIds[10],
        siagaNumber: 'TST011',
        accountNumber: 'A011',
        nip: '1987654331',
        email: 'ahmad.fauzi@test.id',
        username: 'ahmad.fauzi',
        name: 'Ahmad',
        fullname: 'Ahmad Fauzi',
        gender: 'L',
        birthPlace: 'Bogor',
        position: 'Guru',
        phoneNumber: '081234560011',
        province: 'Jawa Barat',
        schoolLevels: 'SMA',
        schoolName: 'SMA Negeri 1 Bogor',
        levels: 'Senior',
        district: 'Bogor',
        education: 'S1',
        studyProgram: 'Pendidikan Biologi',
        university: 'IPB',
        universityType: 'Negeri',
        graduationYear: '2016',
        roles: 'Assessee'
      },
      {
        id: assesseeIds[11],
        siagaNumber: 'TST012',
        accountNumber: 'A012',
        nip: '1987654332',
        email: 'rini.susanti@test.id',
        username: 'rini.susanti',
        name: 'Rini',
        fullname: 'Rini Susanti',
        gender: 'P',
        birthPlace: 'Depok',
        position: 'Guru',
        phoneNumber: '081234560012',
        province: 'Jawa Barat',
        schoolLevels: 'SMP',
        schoolName: 'SMP Negeri 5 Depok',
        levels: 'Middle',
        district: 'Depok',
        education: 'S1',
        studyProgram: 'Pendidikan Bahasa Inggris',
        university: 'UNJ',
        universityType: 'Negeri',
        graduationYear: '2018',
        roles: 'Assessee'
      },
      {
        id: assesseeIds[12],
        siagaNumber: 'TST013',
        accountNumber: 'A013',
        nip: '1987654333',
        email: 'fajar.ramadan@test.id',
        username: 'fajar.ramadan',
        name: 'Fajar',
        fullname: 'Fajar Ramadan',
        gender: 'L',
        birthPlace: 'Bekasi',
        position: 'Guru',
        phoneNumber: '081234560013',
        province: 'Jawa Barat',
        schoolLevels: 'SD',
        schoolName: 'SDN 10 Bekasi',
        levels: 'Junior',
        district: 'Bekasi',
        education: 'S1',
        studyProgram: 'PGSD',
        university: 'UNJ',
        universityType: 'Negeri',
        graduationYear: '2019',
        roles: 'Assessee'
      },
      {
        id: assesseeIds[13],
        siagaNumber: 'TST014',
        accountNumber: 'A014',
        nip: '1987654334',
        email: 'sarah.lestari@test.id',
        username: 'sarah.lestari',
        name: 'Sarah',
        fullname: 'Sarah Lestari',
        gender: 'P',
        birthPlace: 'Tangerang',
        position: 'Guru',
        phoneNumber: '081234560014',
        province: 'Banten',
        schoolLevels: 'SMA',
        schoolName: 'SMA Negeri 2 Tangerang',
        levels: 'Senior',
        district: 'Tangerang',
        education: 'S2',
        studyProgram: 'Pendidikan Ekonomi',
        university: 'UNJ',
        universityType: 'Negeri',
        graduationYear: '2017',
        roles: 'Assessee'
      },
      {
        id: assesseeIds[14],
        siagaNumber: 'TST015',
        accountNumber: 'A015',
        nip: '1987654335',
        email: 'yanto.susilo@test.id',
        username: 'yanto.susilo',
        name: 'Yanto',
        fullname: 'Yanto Susilo',
        gender: 'L',
        birthPlace: 'Jakarta',
        position: 'Staf Lab',
        phoneNumber: '081234560015',
        province: 'DKI Jakarta',
        schoolLevels: 'SMP',
        schoolName: 'SMP Negeri 7 Jakarta',
        levels: 'Middle',
        district: 'Jakarta Timur',
        education: 'D3',
        studyProgram: 'Teknik Laboratorium',
        university: 'UI',
        universityType: 'Negeri',
        graduationYear: '2020',
        roles: 'Assessee'
      }
    ];

    // Insert users
    await queryInterface.bulkInsert('users', assesseeData.map(a => ({
      ...a,
      password: hashedPassword,
      waLink: null,
      createdAt: now,
      updatedAt: now
    })), {});

    // Insert assessee-assessor relationships (untuk grup 2 dan 3)
    const assesseeAssessors = [];
    for (let i = 5; i < 15; i++) {
      assesseeAssessors.push({
        id: randomUUID(),
        assesseeId: assesseeIds[i],
        assessorId: i % 2 === 0 ? assessorId1 : assessorId2,
        createdAt: now,
        updatedAt: now
      });
    }
    await queryInterface.bulkInsert('assessee_assessors', assesseeAssessors, {});

    // Insert assessee-group relationships (untuk grup 2 dan 3)
    const assesseeGroups = [];
    for (let i = 5; i < 15; i++) {
      assesseeGroups.push({
        id: randomUUID(),
        assesseeId: assesseeIds[i],
        criteriaGroupId: criteriaGroupId,
        createdAt: now,
        updatedAt: now
      });
    }
    await queryInterface.bulkInsert('assessee_groups', assesseeGroups, {});

    // Insert assessments (HANYA untuk grup 3)
    const assessments = [];
    for (let i = 10; i < 15; i++) {
      // Create 3 assessments per assessee (one for each criterion)
      for (let j = 0; j < Math.min(3, criteria.length); j++) {
        assessments.push({
          id: randomUUID(),
          assesseeId: assesseeIds[i],
          assessorId: i % 2 === 0 ? assessorId1 : assessorId2,
          criterionId: criteria[j].id,
          score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
          notes: `Penilaian untuk ${assesseeData[i].fullname} pada kriteria ${j + 1}`,
          createdAt: now,
          updatedAt: now
        });
      }
    }
    await queryInterface.bulkInsert('assessments', assessments, {});

    console.log('✅ Test data seeded successfully!');
    console.log('   - 5 assessee BELUM ASESMEN (TST001-TST005)');
    console.log('   - 5 assessee SIAP ASESMEN (TST006-TST010)');
    console.log('   - 5 assessee DENGAN HASIL (TST011-TST015)');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('assessments', {
      assesseeId: { [Sequelize.Op.in]: await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE siagaNumber LIKE 'TST%'`,
        { type: Sequelize.QueryTypes.SELECT }
      ).then(users => users.map(u => u.id)) }
    }, {});
    
    await queryInterface.bulkDelete('assessee_groups', {
      assesseeId: { [Sequelize.Op.in]: await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE siagaNumber LIKE 'TST%'`,
        { type: Sequelize.QueryTypes.SELECT }
      ).then(users => users.map(u => u.id)) }
    }, {});
    
    await queryInterface.bulkDelete('assessee_assessors', {
      assesseeId: { [Sequelize.Op.in]: await queryInterface.sequelize.query(
        `SELECT id FROM users WHERE siagaNumber LIKE 'TST%'`,
        { type: Sequelize.QueryTypes.SELECT }
      ).then(users => users.map(u => u.id)) }
    }, {});
    
    await queryInterface.bulkDelete('users', {
      siagaNumber: { [Sequelize.Op.like]: 'TST%' }
    }, {});
  }
};
