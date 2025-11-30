'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Helper function to check if column exists
    const columnExists = async (table, column) => {
      try {
        const [results] = await queryInterface.sequelize.query(
          `SELECT column_name FROM information_schema.columns WHERE table_name = '${table}' AND column_name = '${column}';`
        );
        return results.length > 0;
      } catch (error) {
        return false;
      }
    };

    // Add columns only if they don't exist
    if (!(await columnExists('participants', 'nik'))) {
      await queryInterface.addColumn('participants', 'nik', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        comment: 'NIK Peserta'
      });
    }

    if (!(await columnExists('participants', 'tanggal_lahir'))) {
      await queryInterface.addColumn('participants', 'tanggal_lahir', {
        type: Sequelize.DATEONLY,
        allowNull: true,
        comment: 'Tanggal Lahir'
      });
    }

    if (!(await columnExists('participants', 'asal_kampus'))) {
      await queryInterface.addColumn('participants', 'asal_kampus', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Asal Kampus'
      });
    }

    if (!(await columnExists('participants', 'fakultas'))) {
      await queryInterface.addColumn('participants', 'fakultas', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Fakultas'
      });
    }

    if (!(await columnExists('participants', 'tingkat_sekolah'))) {
      await queryInterface.addColumn('participants', 'tingkat_sekolah', {
        type: Sequelize.ENUM('MI', 'MTs', 'MA'),
        allowNull: true,
        comment: 'Tingkat Sekolah (MI/MTs/MA)'
      });
    }

    if (!(await columnExists('participants', 'nama_sekolah'))) {
      await queryInterface.addColumn('participants', 'nama_sekolah', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Nama Sekolah'
      });
    }

    if (!(await columnExists('participants', 'alamat_sekolah'))) {
      await queryInterface.addColumn('participants', 'alamat_sekolah', {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Alamat Sekolah'
      });
    }

    if (!(await columnExists('participants', 'kecamatan'))) {
      await queryInterface.addColumn('participants', 'kecamatan', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Kecamatan'
      });
    }

    if (!(await columnExists('participants', 'desa_kelurahan'))) {
      await queryInterface.addColumn('participants', 'desa_kelurahan', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Desa/Kelurahan'
      });
    }

    if (!(await columnExists('participants', 'status_pegawai'))) {
      await queryInterface.addColumn('participants', 'status_pegawai', {
        type: Sequelize.ENUM('PNS', 'PPPK', 'NON_PNS'),
        allowNull: true,
        comment: 'Status Pegawai (PNS/PPPK/NON_PNS)'
      });
    }

    if (!(await columnExists('participants', 'sertifikasi'))) {
      await queryInterface.addColumn('participants', 'sertifikasi', {
        type: Sequelize.ENUM('SUDAH', 'BELUM'),
        allowNull: true,
        comment: 'Status Sertifikasi (SUDAH/BELUM)'
      });
    }

    if (!(await columnExists('participants', 'tahun_sertifikasi'))) {
      await queryInterface.addColumn('participants', 'tahun_sertifikasi', {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Tahun Sertifikasi'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('participants', 'tahun_sertifikasi');
    await queryInterface.removeColumn('participants', 'sertifikasi');
    await queryInterface.removeColumn('participants', 'status_pegawai');
    await queryInterface.removeColumn('participants', 'desa_kelurahan');
    await queryInterface.removeColumn('participants', 'kecamatan');
    await queryInterface.removeColumn('participants', 'alamat_sekolah');
    await queryInterface.removeColumn('participants', 'nama_sekolah');
    await queryInterface.removeColumn('participants', 'tingkat_sekolah');
    await queryInterface.removeColumn('participants', 'fakultas');
    await queryInterface.removeColumn('participants', 'asal_kampus');
    await queryInterface.removeColumn('participants', 'tanggal_lahir');
    await queryInterface.removeColumn('participants', 'nik');
  }
};
