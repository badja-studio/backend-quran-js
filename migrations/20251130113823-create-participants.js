'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('participants', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      akun_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      no_akun: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nip: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nik: {
        type: Sequelize.STRING(16),
        allowNull: true
      },
      jenis_kelamin: {
        type: Sequelize.ENUM('L', 'P'),
        allowNull: false
      },
      tempat_lahir: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tanggal_lahir: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      tingkat_pendidikan: {
        type: Sequelize.ENUM('SD', 'SMP', 'SMA', 'DIPLOMA', 'SARJANA', 'MAGISTER', 'DOKTOR'),
        allowNull: true
      },
      alamat_lengkap: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      provinsi_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'provinces',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      kota_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'cities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      kecamatan_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'districts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      kelurahan_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'villages',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      kode_pos: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      status_pegawai: {
        type: Sequelize.ENUM('PNS', 'PPPK', 'HONORER', 'KONTRAK'),
        allowNull: true
      },
      usia_pegawai: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      sertifikat_profesi: {
        type: Sequelize.STRING,
        allowNull: true
      },
      jabatan: {
        type: Sequelize.STRING,
        allowNull: true
      },
      jenjang: {
        type: Sequelize.STRING,
        allowNull: true
      },
      level: {
        type: Sequelize.STRING,
        allowNull: true
      },
      provinsi: {
        type: Sequelize.STRING,
        allowNull: true
      },
      kab_kota: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sekolah: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pendidikan: {
        type: Sequelize.STRING,
        allowNull: true
      },
      prodi: {
        type: Sequelize.STRING,
        allowNull: true
      },
      perguruan_tinggi: {
        type: Sequelize.STRING,
        allowNull: true
      },
      jenis_pt: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tahun_lulus: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      jadwal: {
        type: Sequelize.STRING,
        allowNull: true
      },
      asesor_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'assessors',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      status: {
        type: Sequelize.ENUM('BELUM','SUDAH'),
        allowNull: false,
        defaultValue: 'BELUM'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('participants');
  }
};
