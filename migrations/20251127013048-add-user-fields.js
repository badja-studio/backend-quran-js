'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'accountNumber', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      comment: 'No. Akun'
    });

    await queryInterface.addColumn('users', 'nip', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Nomor Induk Pegawai'
    });

    await queryInterface.addColumn('users', 'gender', {
      type: Sequelize.ENUM('L', 'P'),
      allowNull: true,
      comment: 'Jenis Kelamin: L=Laki-laki, P=Perempuan'
    });

    await queryInterface.addColumn('users', 'birthPlace', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Tempat Lahir'
    });

    await queryInterface.addColumn('users', 'position', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Jabatan/Pegawai'
    });

    await queryInterface.addColumn('users', 'province', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Provinsi'
    });

    await queryInterface.addColumn('users', 'education', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Pendidikan Terakhir (D3, S1, S2, S3)'
    });

    await queryInterface.addColumn('users', 'studyProgram', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Program Studi'
    });

    await queryInterface.addColumn('users', 'university', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Perguruan Tinggi'
    });

    await queryInterface.addColumn('users', 'universityType', {
      type: Sequelize.ENUM('Negeri', 'Swasta'),
      allowNull: true,
      comment: 'Jenis Perguruan Tinggi'
    });

    await queryInterface.addColumn('users', 'graduationYear', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Tahun Lulus'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'accountNumber');
    await queryInterface.removeColumn('users', 'nip');
    await queryInterface.removeColumn('users', 'gender');
    await queryInterface.removeColumn('users', 'birthPlace');
    await queryInterface.removeColumn('users', 'position');
    await queryInterface.removeColumn('users', 'province');
    await queryInterface.removeColumn('users', 'education');
    await queryInterface.removeColumn('users', 'studyProgram');
    await queryInterface.removeColumn('users', 'university');
    await queryInterface.removeColumn('users', 'universityType');
    await queryInterface.removeColumn('users', 'graduationYear');
  }
};
