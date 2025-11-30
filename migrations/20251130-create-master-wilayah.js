'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create provinces table
    await queryInterface.createTable('provinces', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      kode: {
        type: Sequelize.STRING(2),
        allowNull: false,
        unique: true,
        comment: 'Kode Provinsi (2 digit)'
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Nama Provinsi'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create cities table
    await queryInterface.createTable('cities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      provinsi_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'provinces',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'ID Provinsi'
      },
      kode: {
        type: Sequelize.STRING(4),
        allowNull: false,
        unique: true,
        comment: 'Kode Kab/Kota (4 digit)'
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Nama Kab/Kota'
      },
      tipe: {
        type: Sequelize.ENUM('KABUPATEN', 'KOTA'),
        allowNull: false,
        comment: 'Tipe (KABUPATEN/KOTA)'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Create districts table
    await queryInterface.createTable('districts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      kota_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'ID Kab/Kota'
      },
      kode: {
        type: Sequelize.STRING(7),
        allowNull: false,
        unique: true,
        comment: 'Kode Kecamatan (7 digit)'
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Nama Kecamatan'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Create villages table
    await queryInterface.createTable('villages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      kecamatan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'districts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'ID Kecamatan'
      },
      kode: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
        comment: 'Kode Desa/Kelurahan (10 digit)'
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Nama Desa/Kelurahan'
      },
      tipe: {
        type: Sequelize.ENUM('DESA', 'KELURAHAN'),
        allowNull: false,
        comment: 'Tipe (DESA/KELURAHAN)'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('provinces', ['kode'], { unique: true });
    await queryInterface.addIndex('provinces', ['nama']);
    
    await queryInterface.addIndex('cities', ['kode'], { unique: true });
    await queryInterface.addIndex('cities', ['provinsi_id']);
    await queryInterface.addIndex('cities', ['nama']);
    await queryInterface.addIndex('cities', ['tipe']);
    
    await queryInterface.addIndex('districts', ['kode'], { unique: true });
    await queryInterface.addIndex('districts', ['kota_id']);
    await queryInterface.addIndex('districts', ['nama']);
    
    await queryInterface.addIndex('villages', ['kode'], { unique: true });
    await queryInterface.addIndex('villages', ['kecamatan_id']);
    await queryInterface.addIndex('villages', ['nama']);
    await queryInterface.addIndex('villages', ['tipe']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('villages');
    await queryInterface.dropTable('districts');
    await queryInterface.dropTable('cities');
    await queryInterface.dropTable('provinces');
  }
};
