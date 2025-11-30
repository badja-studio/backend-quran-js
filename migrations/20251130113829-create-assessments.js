'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('assessments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      participant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'participants',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      assessor_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'assessors',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tanggal_penilaian: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      waktu_mulai: {
        type: Sequelize.TIME,
        allowNull: true
      },
      waktu_selesai: {
        type: Sequelize.TIME,
        allowNull: true
      },
      kategori: {
        type: Sequelize.STRING,
        allowNull: false
      },
      skor_total: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      nilai_akhir: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('DIJADWALKAN', 'SEDANG_BERLANGSUNG', 'SELESAI', 'BATAL'),
        allowNull: false,
        defaultValue: 'DIJADWALKAN'
      },
      catatan: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      hasil_penilaian: {
        type: Sequelize.JSON,
        allowNull: true
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
    await queryInterface.dropTable('assessments');
  }
};
