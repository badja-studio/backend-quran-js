'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add missing fields to participants table with conditional checks
    const tableInfo = await queryInterface.describeTable('participants');
    
    if (!tableInfo.asal_kampus) {
      await queryInterface.addColumn('participants', 'asal_kampus', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableInfo.fakultas) {
      await queryInterface.addColumn('participants', 'fakultas', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableInfo.tingkat_sekolah) {
      await queryInterface.addColumn('participants', 'tingkat_sekolah', {
        type: Sequelize.ENUM('MI', 'MTs', 'MA'),
        allowNull: true
      });
    }

    if (!tableInfo.nama_sekolah) {
      await queryInterface.addColumn('participants', 'nama_sekolah', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableInfo.alamat_sekolah) {
      await queryInterface.addColumn('participants', 'alamat_sekolah', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableInfo.desa_kelurahan) {
      await queryInterface.addColumn('participants', 'desa_kelurahan', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableInfo.sertifikasi) {
      await queryInterface.addColumn('participants', 'sertifikasi', {
        type: Sequelize.ENUM('SUDAH', 'BELUM'),
        allowNull: true
      });
    }

    if (!tableInfo.tahun_sertifikasi) {
      await queryInterface.addColumn('participants', 'tahun_sertifikasi', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }

    if (!tableInfo.usia) {
      await queryInterface.addColumn('participants', 'usia', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }

    if (!tableInfo.pegawai) {
      await queryInterface.addColumn('participants', 'pegawai', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  async down (queryInterface, Sequelize) {
    // Remove added fields
    await queryInterface.removeColumn('participants', 'asal_kampus');
    await queryInterface.removeColumn('participants', 'fakultas');
    await queryInterface.removeColumn('participants', 'tingkat_sekolah');
    await queryInterface.removeColumn('participants', 'nama_sekolah');
    await queryInterface.removeColumn('participants', 'alamat_sekolah');
    await queryInterface.removeColumn('participants', 'desa_kelurahan');
    await queryInterface.removeColumn('participants', 'sertifikasi');
    await queryInterface.removeColumn('participants', 'tahun_sertifikasi');
    await queryInterface.removeColumn('participants', 'usia');
    await queryInterface.removeColumn('participants', 'pegawai');
  }
};
