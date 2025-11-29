'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Drop old tables
      await queryInterface.dropTable('assessments', { transaction });
      await queryInterface.dropTable('assessee_groups', { transaction });
      await queryInterface.dropTable('assessee_assessors', { transaction });
      await queryInterface.dropTable('assessee_schedules', { transaction });
      await queryInterface.dropTable('schedules', { transaction });
      await queryInterface.dropTable('criteria', { transaction });
      await queryInterface.dropTable('criteria_groups', { transaction });
      await queryInterface.dropTable('surahs', { transaction });
      await queryInterface.dropTable('users', { transaction });

      // Create new users table (simplified)
      await queryInterface.createTable('users', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        role: {
          type: Sequelize.ENUM('participant', 'assessor', 'admin'),
          allowNull: false,
          defaultValue: 'participant'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      }, { transaction });

      // Create assessors table
      await queryInterface.createTable('assessors', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        no_telepon: {
          type: Sequelize.STRING,
          allowNull: true
        },
        email: {
          type: Sequelize.STRING,
          allowNull: true
        },
        link_grup_wa: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        total_peserta_belum_asesmen: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        total_peserta_selesai_asesmen: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        akun_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      }, { transaction });

      // Create participants table
      await queryInterface.createTable('participants', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        no_akun: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        nip: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        nama: {
          type: Sequelize.STRING,
          allowNull: false
        },
        jenis_kelamin: {
          type: Sequelize.ENUM('L', 'P'),
          allowNull: false
        },
        tempat_lahir: {
          type: Sequelize.STRING,
          allowNull: true
        },
        jabatan: {
          type: Sequelize.STRING,
          allowNull: true
        },
        jenjang: {
          type: Sequelize.STRING,
          allowNull: true
        },
        level: {
          type: Sequelize.STRING,
          allowNull: true
        },
        provinsi: {
          type: Sequelize.STRING,
          allowNull: true
        },
        kab_kota: {
          type: Sequelize.STRING,
          allowNull: true
        },
        sekolah: {
          type: Sequelize.STRING,
          allowNull: true
        },
        pendidikan: {
          type: Sequelize.STRING,
          allowNull: true
        },
        prodi: {
          type: Sequelize.STRING,
          allowNull: true
        },
        perguruan_tinggi: {
          type: Sequelize.STRING,
          allowNull: true
        },
        jenis_pt: {
          type: Sequelize.STRING,
          allowNull: true
        },
        tahun_lulus: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        jadwal: {
          type: Sequelize.STRING,
          allowNull: true
        },
        asesor_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'assessors',
            key: 'id'
          },
          onDelete: 'SET NULL'
        },
        status: {
          type: Sequelize.ENUM('SUDAH', 'BELUM'),
          allowNull: false,
          defaultValue: 'BELUM'
        },
        akun_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      }, { transaction });

      // Create assessments table
      await queryInterface.createTable('assessments', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        peserta_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'participants',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        asesor_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'assessors',
            key: 'id'
          },
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
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      }, { transaction });

      // Add indexes
      await queryInterface.addIndex('assessors', ['username'], { 
        unique: true, 
        transaction 
      });
      await queryInterface.addIndex('assessors', ['akun_id'], { transaction });

      await queryInterface.addIndex('participants', ['no_akun'], { 
        unique: true, 
        transaction 
      });
      await queryInterface.addIndex('participants', ['nip'], { 
        unique: true, 
        transaction 
      });
      await queryInterface.addIndex('participants', ['asesor_id'], { transaction });
      await queryInterface.addIndex('participants', ['akun_id'], { transaction });
      await queryInterface.addIndex('participants', ['status'], { transaction });

      await queryInterface.addIndex('assessments', ['peserta_id'], { transaction });
      await queryInterface.addIndex('assessments', ['asesor_id'], { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Drop new tables
      await queryInterface.dropTable('assessments', { transaction });
      await queryInterface.dropTable('participants', { transaction });
      await queryInterface.dropTable('assessors', { transaction });
      await queryInterface.dropTable('users', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
