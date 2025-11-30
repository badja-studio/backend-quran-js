'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      provinsi_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'provinces',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      kode: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true
      },
      nama: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      tipe: {
        type: Sequelize.ENUM('KABUPATEN', 'KOTA'),
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('cities');
  }
};
