'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Get current table info to check existing columns
    const tableInfo = await queryInterface.describeTable('participants');
    
    // 1. Add new email field (unique, not null)
    if (!tableInfo.email) {
      await queryInterface.addColumn('participants', 'email', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        comment: 'Email Peserta'
      });
    }

    // 2. Add new no_handphone field
    if (!tableInfo.no_handphone) {
      await queryInterface.addColumn('participants', 'no_handphone', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Nomor Handphone Peserta'
      });
    }

    // 3. Add new mata_pelajaran field
    if (!tableInfo.mata_pelajaran) {
      await queryInterface.addColumn('participants', 'mata_pelajaran', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Mata Pelajaran'
      });
    }

    // 4. Modify no_akun field - remove unique constraint and allow null
    if (tableInfo.no_akun) {
      // First remove unique constraint if exists
      try {
        await queryInterface.removeConstraint('participants', 'participants_no_akun_key');
      } catch (error) {
        // Constraint might not exist or have different name, continue
        console.log('Note: Could not remove unique constraint on no_akun, it may not exist');
      }
      
      // Change column to allow null
      await queryInterface.changeColumn('participants', 'no_akun', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Nomor Akun Peserta'
      });
    }

    // 5. Modify nip field - remove unique constraint and allow null
    if (tableInfo.nip) {
      // First remove unique constraint if exists
      try {
        await queryInterface.removeConstraint('participants', 'participants_nip_key');
      } catch (error) {
        // Constraint might not exist or have different name, continue
        console.log('Note: Could not remove unique constraint on nip, it may not exist');
      }
      
      // Change column to allow null
      await queryInterface.changeColumn('participants', 'nip', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'NIP Peserta'
      });
    }
  },

  async down (queryInterface, Sequelize) {
    // Reverse the changes
    
    // 1. Remove added columns
    await queryInterface.removeColumn('participants', 'mata_pelajaran');
    await queryInterface.removeColumn('participants', 'no_handphone');
    await queryInterface.removeColumn('participants', 'email');
    
    // 2. Restore no_akun to not null and unique
    await queryInterface.changeColumn('participants', 'no_akun', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      comment: 'Nomor Akun Peserta'
    });
    
    // 3. Restore nip to not null and unique
    await queryInterface.changeColumn('participants', 'nip', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      comment: 'NIP Peserta'
    });
  }
};
