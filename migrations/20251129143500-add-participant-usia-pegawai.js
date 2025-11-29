'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add usia field to participants table
    await queryInterface.addColumn('participants', 'usia', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Usia Peserta'
    });

    // Add pegawai field to participants table
    await queryInterface.addColumn('participants', 'pegawai', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Status Pegawai'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove pegawai field from participants table
    await queryInterface.removeColumn('participants', 'pegawai');
    
    // Remove usia field from participants table
    await queryInterface.removeColumn('participants', 'usia');
  }
};
