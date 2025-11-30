'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('participants', 'usia', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Usia peserta dalam tahun'
    });

    await queryInterface.addColumn('participants', 'pegawai', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Status kepegawaian peserta'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('participants', 'usia');
    await queryInterface.removeColumn('participants', 'pegawai');
  }
};
