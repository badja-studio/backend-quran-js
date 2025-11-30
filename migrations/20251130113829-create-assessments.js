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
      peserta_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'participants',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      asesor_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'assessors',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      huruf: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nilai: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      kategori: {
        type: Sequelize.STRING,
        allowNull: false
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

    // Create unique index
    await queryInterface.addIndex('assessments', ['peserta_id', 'asesor_id', 'huruf'], {
      unique: true,
      name: 'assessments_peserta_asesor_huruf_unique'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('assessments');
  }
};
