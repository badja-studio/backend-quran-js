'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Check and remove foreign key constraints if they exist
    try {
      await queryInterface.removeConstraint('participants', 'participants_provinsi_id_fkey');
    } catch (e) { /* constraint doesn't exist */ }
    
    try {
      await queryInterface.removeConstraint('participants', 'participants_kota_id_fkey');
    } catch (e) { /* constraint doesn't exist */ }
    
    try {
      await queryInterface.removeConstraint('participants', 'participants_kecamatan_id_fkey');
    } catch (e) { /* constraint doesn't exist */ }
    
    try {
      await queryInterface.removeConstraint('participants', 'participants_kelurahan_id_fkey');
    } catch (e) { /* constraint doesn't exist */ }
    
    // Remove ID columns if they exist
    try {
      await queryInterface.removeColumn('participants', 'provinsi_id');
    } catch (e) { /* column doesn't exist */ }
    
    try {
      await queryInterface.removeColumn('participants', 'kota_id');
    } catch (e) { /* column doesn't exist */ }
    
    try {
      await queryInterface.removeColumn('participants', 'kecamatan_id');
    } catch (e) { /* column doesn't exist */ }
    
    try {
      await queryInterface.removeColumn('participants', 'kelurahan_id');
    } catch (e) { /* column doesn't exist */ }

    // Add string columns for geography names if they don't exist
    try {
      await queryInterface.addColumn('participants', 'provinsi', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Nama Provinsi'
      });
    } catch (e) { /* column already exists */ }

    // Rename kab_kota to kota if it exists
    try {
      await queryInterface.renameColumn('participants', 'kab_kota', 'kota');
    } catch (e) { 
      // If kab_kota doesn't exist, add kota column
      try {
        await queryInterface.addColumn('participants', 'kota', {
          type: Sequelize.STRING,
          allowNull: true,
          comment: 'Nama Kota/Kabupaten'
        });
      } catch (e2) { /* column already exists */ }
    }

    try {
      await queryInterface.addColumn('participants', 'kecamatan', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Nama Kecamatan'
      });
    } catch (e) { /* column already exists */ }

    try {
      await queryInterface.addColumn('participants', 'kelurahan', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Nama Kelurahan/Desa'
      });
    } catch (e) { /* column already exists */ }
  },

  async down (queryInterface, Sequelize) {
    // Remove string columns
    await queryInterface.removeColumn('participants', 'provinsi');
    await queryInterface.removeColumn('participants', 'kota');
    await queryInterface.removeColumn('participants', 'kecamatan');
    await queryInterface.removeColumn('participants', 'kelurahan');

    // Add back ID columns with foreign keys
    await queryInterface.addColumn('participants', 'provinsi_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'provinces',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('participants', 'kota_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'cities',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('participants', 'kecamatan_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'districts',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('participants', 'kelurahan_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'villages',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  }
};
