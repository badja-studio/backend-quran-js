const { Province, City, District, Village } = require('../internal/models');

const seedMasterWilayah = async () => {
  console.log('🌱 Seeding master wilayah data...');

  try {
    // Seed Provinces (Sample provinces)
    console.log('🏛️  Seeding provinces...');
    const provinces = await Province.bulkCreate([
      { kode: '11', nama: 'ACEH' },
      { kode: '12', nama: 'SUMATERA UTARA' },
      { kode: '13', nama: 'SUMATERA BARAT' },
      { kode: '14', nama: 'RIAU' },
      { kode: '15', nama: 'JAMBI' },
      { kode: '16', nama: 'SUMATERA SELATAN' },
      { kode: '17', nama: 'BENGKULU' },
      { kode: '18', nama: 'LAMPUNG' },
      { kode: '19', nama: 'KEPULAUAN BANGKA BELITUNG' },
      { kode: '21', nama: 'KEPULAUAN RIAU' },
      { kode: '31', nama: 'DKI JAKARTA' },
      { kode: '32', nama: 'JAWA BARAT' },
      { kode: '33', nama: 'JAWA TENGAH' },
      { kode: '34', nama: 'DI YOGYAKARTA' },
      { kode: '35', nama: 'JAWA TIMUR' },
      { kode: '36', nama: 'BANTEN' },
      { kode: '51', nama: 'BALI' },
      { kode: '52', nama: 'NUSA TENGGARA BARAT' },
      { kode: '53', nama: 'NUSA TENGGARA TIMUR' },
      { kode: '61', nama: 'KALIMANTAN BARAT' },
      { kode: '62', nama: 'KALIMANTAN TENGAH' },
      { kode: '63', nama: 'KALIMANTAN SELATAN' },
      { kode: '64', nama: 'KALIMANTAN TIMUR' },
      { kode: '65', nama: 'KALIMANTAN UTARA' },
      { kode: '71', nama: 'SULAWESI UTARA' },
      { kode: '72', nama: 'SULAWESI TENGAH' },
      { kode: '73', nama: 'SULAWESI SELATAN' },
      { kode: '74', nama: 'SULAWESI TENGGARA' },
      { kode: '75', nama: 'GORONTALO' },
      { kode: '76', nama: 'SULAWESI BARAT' },
      { kode: '81', nama: 'MALUKU' },
      { kode: '82', nama: 'MALUKU UTARA' },
      { kode: '91', nama: 'PAPUA BARAT' },
      { kode: '94', nama: 'PAPUA' }
    ], {
      ignoreDuplicates: true
    });

    // Get created provinces for reference
    const allProvinces = await Province.findAll();
    const provinceMap = {};
    allProvinces.forEach(province => {
      provinceMap[province.kode] = province.id;
    });

    // Seed Cities (Sample cities for major provinces)
    console.log('🏙️  Seeding cities...');
    const cities = await City.bulkCreate([
      // DKI Jakarta
      { provinsi_id: provinceMap['31'], kode: '3171', nama: 'KEPULAUAN SERIBU', tipe: 'KABUPATEN' },
      { provinsi_id: provinceMap['31'], kode: '3172', nama: 'JAKARTA SELATAN', tipe: 'KOTA' },
      { provinsi_id: provinceMap['31'], kode: '3173', nama: 'JAKARTA TIMUR', tipe: 'KOTA' },
      { provinsi_id: provinceMap['31'], kode: '3174', nama: 'JAKARTA PUSAT', tipe: 'KOTA' },
      { provinsi_id: provinceMap['31'], kode: '3175', nama: 'JAKARTA BARAT', tipe: 'KOTA' },
      { provinsi_id: provinceMap['31'], kode: '3176', nama: 'JAKARTA UTARA', tipe: 'KOTA' },
      
      // Jawa Barat
      { provinsi_id: provinceMap['32'], kode: '3201', nama: 'BOGOR', tipe: 'KABUPATEN' },
      { provinsi_id: provinceMap['32'], kode: '3202', nama: 'SUKABUMI', tipe: 'KABUPATEN' },
      { provinsi_id: provinceMap['32'], kode: '3203', nama: 'CIANJUR', tipe: 'KABUPATEN' },
      { provinsi_id: provinceMap['32'], kode: '3204', nama: 'BANDUNG', tipe: 'KABUPATEN' },
      { provinsi_id: provinceMap['32'], kode: '3271', nama: 'BOGOR', tipe: 'KOTA' },
      { provinsi_id: provinceMap['32'], kode: '3272', nama: 'SUKABUMI', tipe: 'KOTA' },
      { provinsi_id: provinceMap['32'], kode: '3273', nama: 'BANDUNG', tipe: 'KOTA' },
      { provinsi_id: provinceMap['32'], kode: '3274', nama: 'CIREBON', tipe: 'KOTA' },
      { provinsi_id: provinceMap['32'], kode: '3275', nama: 'BEKASI', tipe: 'KOTA' },
      { provinsi_id: provinceMap['32'], kode: '3276', nama: 'DEPOK', tipe: 'KOTA' },
      
      // Jawa Tengah
      { provinsi_id: provinceMap['33'], kode: '3301', nama: 'CILACAP', tipe: 'KABUPATEN' },
      { provinsi_id: provinceMap['33'], kode: '3302', nama: 'BANYUMAS', tipe: 'KABUPATEN' },
      { provinsi_id: provinceMap['33'], kode: '3303', nama: 'PURBALINGGA', tipe: 'KABUPATEN' },
      { provinsi_id: provinceMap['33'], kode: '3371', nama: 'MAGELANG', tipe: 'KOTA' },
      { provinsi_id: provinceMap['33'], kode: '3372', nama: 'SURAKARTA', tipe: 'KOTA' },
      { provinsi_id: provinceMap['33'], kode: '3373', nama: 'SALATIGA', tipe: 'KOTA' },
      { provinsi_id: provinceMap['33'], kode: '3374', nama: 'SEMARANG', tipe: 'KOTA' },
      
      // Jawa Timur
      { provinsi_id: provinceMap['35'], kode: '3501', nama: 'PACITAN', tipe: 'KABUPATEN' },
      { provinsi_id: provinceMap['35'], kode: '3502', nama: 'PONOROGO', tipe: 'KABUPATEN' },
      { provinsi_id: provinceMap['35'], kode: '3571', nama: 'KEDIRI', tipe: 'KOTA' },
      { provinsi_id: provinceMap['35'], kode: '3572', nama: 'BLITAR', tipe: 'KOTA' },
      { provinsi_id: provinceMap['35'], kode: '3573', nama: 'MALANG', tipe: 'KOTA' },
      { provinsi_id: provinceMap['35'], kode: '3574', nama: 'PROBOLINGGO', tipe: 'KOTA' },
      { provinsi_id: provinceMap['35'], kode: '3575', nama: 'PASURUAN', tipe: 'KOTA' },
      { provinsi_id: provinceMap['35'], kode: '3576', nama: 'MOJOKERTO', tipe: 'KOTA' },
      { provinsi_id: provinceMap['35'], kode: '3577', nama: 'MADIUN', tipe: 'KOTA' },
      { provinsi_id: provinceMap['35'], kode: '3578', nama: 'SURABAYA', tipe: 'KOTA' },
      { provinsi_id: provinceMap['35'], kode: '3579', nama: 'BATU', tipe: 'KOTA' }
    ], {
      ignoreDuplicates: true
    });

    // Get created cities for reference
    const allCities = await City.findAll();
    const cityMap = {};
    allCities.forEach(city => {
      cityMap[city.kode] = city.id;
    });

    // Seed Districts (Sample districts for major cities)
    console.log('🏘️  Seeding districts...');
    const districts = await District.bulkCreate([
      // Jakarta Pusat
      { kota_id: cityMap['3174'], kode: '3174010', nama: 'GAMBIR' },
      { kota_id: cityMap['3174'], kode: '3174020', nama: 'SAWAH BESAR' },
      { kota_id: cityMap['3174'], kode: '3174030', nama: 'KEMAYORAN' },
      { kota_id: cityMap['3174'], kode: '3174040', nama: 'SENEN' },
      { kota_id: cityMap['3174'], kode: '3174050', nama: 'CEMPAKA PUTIH' },
      { kota_id: cityMap['3174'], kode: '3174060', nama: 'MENTENG' },
      { kota_id: cityMap['3174'], kode: '3174070', nama: 'TANAH ABANG' },
      { kota_id: cityMap['3174'], kode: '3174080', nama: 'JOHAR BARU' },
      
      // Bandung
      { kota_id: cityMap['3273'], kode: '3273010', nama: 'SUKASARI' },
      { kota_id: cityMap['3273'], kode: '3273020', nama: 'COBLONG' },
      { kota_id: cityMap['3273'], kode: '3273030', nama: 'ANDIR' },
      { kota_id: cityMap['3273'], kode: '3273040', nama: 'CICENDO' },
      { kota_id: cityMap['3273'], kode: '3273050', nama: 'BANDUNG KULON' },
      { kota_id: cityMap['3273'], kode: '3273060', nama: 'BANDUNG WETAN' },
      
      // Surabaya
      { kota_id: cityMap['3578'], kode: '3578010', nama: 'KARANG PILANG' },
      { kota_id: cityMap['3578'], kode: '3578020', nama: 'WONOCOLO' },
      { kota_id: cityMap['3578'], kode: '3578030', nama: 'RUNGKUT' },
      { kota_id: cityMap['3578'], kode: '3578040', nama: 'WONOKROMO' },
      { kota_id: cityMap['3578'], kode: '3578050', nama: 'TEGALSARI' },
      { kota_id: cityMap['3578'], kode: '3578060', nama: 'SAWAHAN' }
    ], {
      ignoreDuplicates: true
    });

    // Get created districts for reference
    const allDistricts = await District.findAll();
    const districtMap = {};
    allDistricts.forEach(district => {
      districtMap[district.kode] = district.id;
    });

    // Seed Villages (Sample villages for some districts)
    console.log('🏡 Seeding villages...');
    const villages = await Village.bulkCreate([
      // Gambir, Jakarta Pusat
      { kecamatan_id: districtMap['3174010'], kode: '3174010001', nama: 'GAMBIR', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3174010'], kode: '3174010002', nama: 'CIDENG', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3174010'], kode: '3174010003', nama: 'PETOJO UTARA', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3174010'], kode: '3174010004', nama: 'PETOJO SELATAN', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3174010'], kode: '3174010005', nama: 'KEBON KELAPA', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3174010'], kode: '3174010006', nama: 'DURI PULO', tipe: 'KELURAHAN' },
      
      // Menteng, Jakarta Pusat
      { kecamatan_id: districtMap['3174060'], kode: '3174060001', nama: 'MENTENG', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3174060'], kode: '3174060002', nama: 'PEGANGSAAN', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3174060'], kode: '3174060003', nama: 'CIKINI', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3174060'], kode: '3174060004', nama: 'GONDANGDIA', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3174060'], kode: '3174060005', nama: 'KEBON SIRIH', tipe: 'KELURAHAN' },
      
      // Coblong, Bandung
      { kecamatan_id: districtMap['3273020'], kode: '3273020001', nama: 'CIPAGANTI', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3273020'], kode: '3273020002', nama: 'SEKELOA', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3273020'], kode: '3273020003', nama: 'LEBAK GEDE', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3273020'], kode: '3273020004', nama: 'LEBAK SILIWANGI', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3273020'], kode: '3273020005', nama: 'SADANG SERANG', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3273020'], kode: '3273020006', nama: 'DAGO', tipe: 'KELURAHAN' },
      
      // Tegalsari, Surabaya
      { kecamatan_id: districtMap['3578050'], kode: '3578050001', nama: 'WONOREJO', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3578050'], kode: '3578050002', nama: 'TEGALSARI', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3578050'], kode: '3578050003', nama: 'KEPUTRAN', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3578050'], kode: '3578050004', nama: 'DR. SOETOMO', tipe: 'KELURAHAN' },
      { kecamatan_id: districtMap['3578050'], kode: '3578050005', nama: 'KEDUNGDORO', tipe: 'KELURAHAN' }
    ], {
      ignoreDuplicates: true
    });

    console.log('✅ Master wilayah data seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${provinces.length} provinces seeded`);
    console.log(`   - ${cities.length} cities seeded`);
    console.log(`   - ${districts.length} districts seeded`);
    console.log(`   - ${villages.length} villages seeded`);

  } catch (error) {
    console.error('❌ Error seeding master wilayah data:', error);
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedMasterWilayah()
    .then(() => {
      console.log('🎉 Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedMasterWilayah;
