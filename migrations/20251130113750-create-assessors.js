'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('assessors', {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nip: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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
      alamat: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      no_telepon: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      spesialisasi: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('AKTIF', 'TIDAK_AKTIF'),
        allowNull: false,
        defaultValue: 'AKTIF'
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
    await queryInterface.dropTable('assessors');
  }
};
