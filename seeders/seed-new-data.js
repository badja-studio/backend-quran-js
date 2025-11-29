const { User, Assessor, Participant, Assessment } = require('../internal/models');
const bcrypt = require('bcrypt');

async function seedUsers() {
  console.log('Seeding users...');
  
  const users = [
    // Admin user
    {
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin'
    },
    // Assessor users
    {
      username: '19751201001',
      password: await bcrypt.hash('19751201001', 10),
      role: 'assessor'
    },
    {
      username: '19801215002',
      password: await bcrypt.hash('19801215002', 10),
      role: 'assessor'
    },
    {
      username: '19850320003',
      password: await bcrypt.hash('19850320003', 10),
      role: 'assessor'
    },
    // Participant users (using NIP as username)
    {
      username: '197512010001',
      password: await bcrypt.hash('197512010001', 10),
      role: 'participant'
    },
    {
      username: '198012150002',
      password: await bcrypt.hash('198012150002', 10),
      role: 'participant'
    },
    {
      username: '198503200003',
      password: await bcrypt.hash('198503200003', 10),
      role: 'participant'
    },
    {
      username: '199002100004',
      password: await bcrypt.hash('199002100004', 10),
      role: 'participant'
    },
    {
      username: '199105180005',
      password: await bcrypt.hash('199105180005', 10),
      role: 'participant'
    },
    {
      username: '199208220006',
      password: await bcrypt.hash('199208220006', 10),
      role: 'participant'
    },
    {
      username: '199311120007',
      password: await bcrypt.hash('199311120007', 10),
      role: 'participant'
    },
    {
      username: '199407250008',
      password: await bcrypt.hash('199407250008', 10),
      role: 'participant'
    }
  ];

  await User.bulkCreate(users);
  console.log(`${users.length} users seeded successfully`);
}

async function seedAssessors() {
  console.log('Seeding assessors...');
  
  const assessorUsers = await User.findAll({ where: { role: 'assessor' } });
  
  const assessors = [
    {
      name: 'Dr. Ahmad Syukri, M.Pd.I',
      username: '19751201001',
      no_telepon: '081234567890',
      email: 'ahmad.syukri@email.com',
      link_grup_wa: 'https://chat.whatsapp.com/assessor1',
      total_peserta_belum_asesmen: 0,
      total_peserta_selesai_asesmen: 0,
      akun_id: assessorUsers[0].id
    },
    {
      name: 'Prof. Dr. Siti Aminah, M.A',
      username: '19801215002',
      no_telepon: '081234567891',
      email: 'siti.aminah@email.com',
      link_grup_wa: 'https://chat.whatsapp.com/assessor2',
      total_peserta_belum_asesmen: 0,
      total_peserta_selesai_asesmen: 0,
      akun_id: assessorUsers[1].id
    },
    {
      name: 'Dr. Muhammad Yusuf, Lc., M.Th.I',
      username: '19850320003',
      no_telepon: '081234567892',
      email: 'muhammad.yusuf@email.com',
      link_grup_wa: 'https://chat.whatsapp.com/assessor3',
      total_peserta_belum_asesmen: 0,
      total_peserta_selesai_asesmen: 0,
      akun_id: assessorUsers[2].id
    }
  ];

  await Assessor.bulkCreate(assessors);
  console.log(`${assessors.length} assessors seeded successfully`);
}

async function seedParticipants() {
  console.log('Seeding participants...');
  
  const participantUsers = await User.findAll({ where: { role: 'participant' } });
  const assessors = await Assessor.findAll();
  
  const participants = [
    {
      no_akun: 'P001',
      nip: '197512010001',
      nama: 'Ahmad Fauzi',
      jenis_kelamin: 'L',
      tempat_lahir: 'Jakarta',
      jabatan: 'Guru Agama Islam',
      jenjang: 'SD',
      level: 'Pemula',
      provinsi: 'DKI Jakarta',
      kab_kota: 'Jakarta Selatan',
      sekolah: 'SDN 01 Jakarta',
      pendidikan: 'S1',
      prodi: 'Pendidikan Agama Islam',
      perguruan_tinggi: 'UIN Syarif Hidayatullah',
      jenis_pt: 'Negeri',
      tahun_lulus: 2000,
      jadwal: '2024-12-01 08:00:00',
      asesor_id: assessors[0].id,
      status: 'BELUM',
      akun_id: participantUsers[0].id
    },
    {
      no_akun: 'P002',
      nip: '198012150002',
      nama: 'Siti Rahma',
      jenis_kelamin: 'P',
      tempat_lahir: 'Bandung',
      jabatan: 'Guru Agama Islam',
      jenjang: 'SMP',
      level: 'Menengah',
      provinsi: 'Jawa Barat',
      kab_kota: 'Bandung',
      sekolah: 'SMPN 02 Bandung',
      pendidikan: 'S1',
      prodi: 'Pendidikan Agama Islam',
      perguruan_tinggi: 'UPI Bandung',
      jenis_pt: 'Negeri',
      tahun_lulus: 2005,
      jadwal: '2024-12-01 10:00:00',
      asesor_id: assessors[0].id,
      status: 'BELUM',
      akun_id: participantUsers[1].id
    },
    {
      no_akun: 'P003',
      nip: '198503200003',
      nama: 'Muhammad Rizki',
      jenis_kelamin: 'L',
      tempat_lahir: 'Surabaya',
      jabatan: 'Guru Agama Islam',
      jenjang: 'SMA',
      level: 'Lanjut',
      provinsi: 'Jawa Timur',
      kab_kota: 'Surabaya',
      sekolah: 'SMAN 01 Surabaya',
      pendidikan: 'S2',
      prodi: 'Studi Islam',
      perguruan_tinggi: 'UIN Sunan Ampel',
      jenis_pt: 'Negeri',
      tahun_lulus: 2010,
      jadwal: '2024-12-01 13:00:00',
      asesor_id: assessors[1].id,
      status: 'BELUM',
      akun_id: participantUsers[2].id
    },
    {
      no_akun: 'P004',
      nip: '199002100004',
      nama: 'Fatimah Zahra',
      jenis_kelamin: 'P',
      tempat_lahir: 'Medan',
      jabatan: 'Guru Agama Islam',
      jenjang: 'SD',
      level: 'Pemula',
      provinsi: 'Sumatera Utara',
      kab_kota: 'Medan',
      sekolah: 'SDN 05 Medan',
      pendidikan: 'S1',
      prodi: 'Tarbiyah',
      perguruan_tinggi: 'UIN Sumatera Utara',
      jenis_pt: 'Negeri',
      tahun_lulus: 2015,
      jadwal: '2024-12-01 15:00:00',
      asesor_id: assessors[1].id,
      status: 'BELUM',
      akun_id: participantUsers[3].id
    },
    {
      no_akun: 'P005',
      nip: '199105180005',
      nama: 'Ali Hassan',
      jenis_kelamin: 'L',
      tempat_lahir: 'Makassar',
      jabatan: 'Guru Agama Islam',
      jenjang: 'SMP',
      level: 'Menengah',
      provinsi: 'Sulawesi Selatan',
      kab_kota: 'Makassar',
      sekolah: 'SMPN 03 Makassar',
      pendidikan: 'S1',
      prodi: 'Pendidikan Agama Islam',
      perguruan_tinggi: 'UIN Alauddin',
      jenis_pt: 'Negeri',
      tahun_lulus: 2016,
      jadwal: '2024-12-02 08:00:00',
      asesor_id: assessors[2].id,
      status: 'SUDAH',
      akun_id: participantUsers[4].id
    },
    {
      no_akun: 'P006',
      nip: '199208220006',
      nama: 'Khadijah Amin',
      jenis_kelamin: 'P',
      tempat_lahir: 'Yogyakarta',
      jabatan: 'Guru Agama Islam',
      jenjang: 'SMA',
      level: 'Lanjut',
      provinsi: 'DI Yogyakarta',
      kab_kota: 'Yogyakarta',
      sekolah: 'SMAN 02 Yogyakarta',
      pendidikan: 'S2',
      prodi: 'Studi Islam',
      perguruan_tinggi: 'UIN Sunan Kalijaga',
      jenis_pt: 'Negeri',
      tahun_lulus: 2017,
      jadwal: '2024-12-02 10:00:00',
      asesor_id: assessors[2].id,
      status: 'SUDAH',
      akun_id: participantUsers[5].id
    },
    {
      no_akun: 'P007',
      nip: '199311120007',
      nama: 'Omar Faruq',
      jenis_kelamin: 'L',
      tempat_lahir: 'Palembang',
      jabatan: 'Guru Agama Islam',
      jenjang: 'SD',
      level: 'Pemula',
      provinsi: 'Sumatera Selatan',
      kab_kota: 'Palembang',
      sekolah: 'SDN 07 Palembang',
      pendidikan: 'S1',
      prodi: 'Pendidikan Agama Islam',
      perguruan_tinggi: 'UIN Raden Fatah',
      jenis_pt: 'Negeri',
      tahun_lulus: 2018,
      jadwal: '2024-12-02 13:00:00',
      asesor_id: null,
      status: 'BELUM',
      akun_id: participantUsers[6].id
    },
    {
      no_akun: 'P008',
      nip: '199407250008',
      nama: 'Aisyah Putri',
      jenis_kelamin: 'P',
      tempat_lahir: 'Denpasar',
      jabatan: 'Guru Agama Islam',
      jenjang: 'SMP',
      level: 'Menengah',
      provinsi: 'Bali',
      kab_kota: 'Denpasar',
      sekolah: 'SMPN 04 Denpasar',
      pendidikan: 'S1',
      prodi: 'Tarbiyah',
      perguruan_tinggi: 'UIN Mataram',
      jenis_pt: 'Negeri',
      tahun_lulus: 2019,
      jadwal: '2024-12-02 15:00:00',
      asesor_id: null,
      status: 'BELUM',
      akun_id: participantUsers[7].id
    }
  ];

  await Participant.bulkCreate(participants);
  console.log(`${participants.length} participants seeded successfully`);
}

async function seedAssessments() {
  console.log('Seeding assessments...');
  
  const assessors = await Assessor.findAll();
  const participants = await Participant.findAll({ where: { status: 'SUDAH' } });
  
  const assessments = [
    // Assessments for Ali Hassan (participant 5)
    {
      peserta_id: participants[0].id,
      asesor_id: assessors[2].id,
      huruf: 'A',
      nilai: 95,
      kategori: 'Tajwid'
    },
    {
      peserta_id: participants[0].id,
      asesor_id: assessors[2].id,
      huruf: 'B',
      nilai: 88,
      kategori: 'Makhorijul Huruf'
    },
    {
      peserta_id: participants[0].id,
      asesor_id: assessors[2].id,
      huruf: 'A',
      nilai: 92,
      kategori: 'Kelancaran'
    },
    {
      peserta_id: participants[0].id,
      asesor_id: assessors[2].id,
      huruf: 'B',
      nilai: 85,
      kategori: 'Fashohah'
    },
    // Assessments for Khadijah Amin (participant 6)
    {
      peserta_id: participants[1].id,
      asesor_id: assessors[2].id,
      huruf: 'A',
      nilai: 98,
      kategori: 'Tajwid'
    },
    {
      peserta_id: participants[1].id,
      asesor_id: assessors[2].id,
      huruf: 'A',
      nilai: 96,
      kategori: 'Makhorijul Huruf'
    },
    {
      peserta_id: participants[1].id,
      asesor_id: assessors[2].id,
      huruf: 'A',
      nilai: 94,
      kategori: 'Kelancaran'
    },
    {
      peserta_id: participants[1].id,
      asesor_id: assessors[2].id,
      huruf: 'A',
      nilai: 97,
      kategori: 'Fashohah'
    }
  ];

  await Assessment.bulkCreate(assessments);
  console.log(`${assessments.length} assessments seeded successfully`);
}

async function updateAssessorCounts() {
  console.log('Updating assessor participant counts...');
  
  const assessors = await Assessor.findAll();
  
  for (const assessor of assessors) {
    const belumCount = await Participant.count({
      where: { 
        asesor_id: assessor.id,
        status: 'BELUM'
      }
    });

    const sudahCount = await Participant.count({
      where: { 
        asesor_id: assessor.id,
        status: 'SUDAH'
      }
    });

    await assessor.update({
      total_peserta_belum_asesmen: belumCount,
      total_peserta_selesai_asesmen: sudahCount
    });
  }
  
  console.log('Assessor counts updated successfully');
}

async function seedData() {
  try {
    console.log('Starting data seeding...');
    
    // Clear existing data in correct order (reverse of foreign key dependencies)
    await Assessment.destroy({ where: {} });
    await Participant.destroy({ where: {} });
    await Assessor.destroy({ where: {} });
    await User.destroy({ where: {} });
    
    console.log('Existing data cleared');
    
    // Seed new data
    await seedUsers();
    await seedAssessors();
    await seedParticipants();
    await seedAssessments();
    await updateAssessorCounts();
    
    console.log('Data seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

module.exports = { seedData };

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
