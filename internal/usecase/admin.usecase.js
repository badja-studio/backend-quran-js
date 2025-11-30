const bcrypt = require('bcryptjs');
const { sequelize } = require('../../config/database');
const AdminRepository = require('../repository/admin.repository');
const { User } = require('../models');

class AdminUseCase {
  constructor() {
    this.adminRepository = new AdminRepository();
  }

  async createAdmin(adminData) {
    const transaction = await sequelize.transaction();
    
    try {
      const { name, username, email, phone } = adminData;

      // Validate required fields
      if (!name || !username || !email) {
        throw new Error('Name, username, and email are required');
      }

      // Check if username already exists in admins
      const existingAdminByUsername = await this.adminRepository.checkUsernameExists(username, null, transaction);
      if (existingAdminByUsername) {
        throw new Error('Username already exists in admin records');
      }

      // Check if email already exists in admins
      const existingAdminByEmail = await this.adminRepository.checkEmailExists(email, null, transaction);
      if (existingAdminByEmail) {
        throw new Error('Email already exists in admin records');
      }

      // Check if username already exists in users table
      const existingUser = await User.findOne({
        where: { username },
        transaction,
      });
      if (existingUser) {
        throw new Error('Username already exists in system');
      }

      // Check if email already exists in users table
      const existingUserByEmail = await User.findOne({
        where: { email },
        transaction,
      });
      if (existingUserByEmail) {
        throw new Error('Email already exists in system');
      }

      // Create user first (username becomes password)
      const hashedPassword = await bcrypt.hash(username, 10);
      
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role: 'admin',
        is_active: true,
      }, { transaction });

      // Create admin record
      const newAdmin = await this.adminRepository.create({
        name,
        username,
        email,
        phone: phone || null,
        user_id: newUser.id,
      }, transaction);

      await transaction.commit();

      // Return admin with user info and generated credentials
      return {
        admin: newAdmin,
        credentials: {
          username,
          password: username, // Plain text for response only
          message: 'Admin created successfully. Username serves as initial password.',
        },
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to create admin: ${error.message}`);
    }
  }

  async getAllAdmins(queryParams) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'created_at',
        sortOrder = 'DESC',
        filters = [],
      } = queryParams;

      // Parse filters if it's a string
      let parsedFilters = filters;
      if (typeof filters === 'string') {
        try {
          parsedFilters = JSON.parse(filters);
        } catch (e) {
          parsedFilters = [];
        }
      }

      const result = await this.adminRepository.findAll({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        sortBy,
        sortOrder: sortOrder.toUpperCase(),
        filters: parsedFilters,
      });

      return result;
    } catch (error) {
      throw new Error(`Failed to fetch admins: ${error.message}`);
    }
  }

  async getAdminById(id) {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Valid admin ID is required');
      }

      const admin = await this.adminRepository.findById(parseInt(id));
      
      if (!admin) {
        throw new Error('Admin not found');
      }

      return admin;
    } catch (error) {
      throw new Error(`Failed to fetch admin: ${error.message}`);
    }
  }

  async getAdminByUsername(username) {
    try {
      if (!username) {
        throw new Error('Username is required');
      }

      const admin = await this.adminRepository.findByUsername(username);
      
      if (!admin) {
        throw new Error('Admin not found');
      }

      return admin;
    } catch (error) {
      throw new Error(`Failed to fetch admin: ${error.message}`);
    }
  }

  async getAdminByUserId(userId) {
    try {
      if (!userId || isNaN(userId)) {
        throw new Error('Valid user ID is required');
      }

      const admin = await this.adminRepository.findByUserId(parseInt(userId));
      
      if (!admin) {
        throw new Error('Admin not found');
      }

      return admin;
    } catch (error) {
      throw new Error(`Failed to fetch admin: ${error.message}`);
    }
  }

  async updateAdmin(id, updateData) {
    const transaction = await sequelize.transaction();
    
    try {
      if (!id || isNaN(id)) {
        throw new Error('Valid admin ID is required');
      }

      const { name, username, email, phone } = updateData;

      // Validate at least one field to update
      if (!name && !username && !email && phone === undefined) {
        throw new Error('At least one field must be provided for update');
      }

      // Check if admin exists
      const existingAdmin = await this.adminRepository.findById(parseInt(id), transaction);
      if (!existingAdmin) {
        throw new Error('Admin not found');
      }

      // Check username uniqueness if provided
      if (username && username !== existingAdmin.username) {
        const usernameExists = await this.adminRepository.checkUsernameExists(username, id, transaction);
        if (usernameExists) {
          throw new Error('Username already exists');
        }

        // Also check in users table
        const userExists = await User.findOne({
          where: { 
            username,
            id: { [require('sequelize').Op.ne]: existingAdmin.user_id }
          },
          transaction,
        });
        if (userExists) {
          throw new Error('Username already exists in system');
        }

        // Update user table as well
        await User.update(
          { username },
          { 
            where: { id: existingAdmin.user_id },
            transaction 
          }
        );
      }

      // Check email uniqueness if provided
      if (email && email !== existingAdmin.email) {
        const emailExists = await this.adminRepository.checkEmailExists(email, id, transaction);
        if (emailExists) {
          throw new Error('Email already exists');
        }

        // Also check in users table
        const userEmailExists = await User.findOne({
          where: { 
            email,
            id: { [require('sequelize').Op.ne]: existingAdmin.user_id }
          },
          transaction,
        });
        if (userEmailExists) {
          throw new Error('Email already exists in system');
        }

        // Update user table as well
        await User.update(
          { email },
          { 
            where: { id: existingAdmin.user_id },
            transaction 
          }
        );
      }

      // Update admin record
      const updatedAdmin = await this.adminRepository.update(
        parseInt(id),
        { name, username, email, phone },
        transaction
      );

      await transaction.commit();

      return updatedAdmin;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to update admin: ${error.message}`);
    }
  }

  async deleteAdmin(id) {
    const transaction = await sequelize.transaction();
    
    try {
      if (!id || isNaN(id)) {
        throw new Error('Valid admin ID is required');
      }

      // Check if admin exists
      const existingAdmin = await this.adminRepository.findById(parseInt(id), transaction);
      if (!existingAdmin) {
        throw new Error('Admin not found');
      }

      // Delete admin (this will cascade to user due to foreign key constraint)
      await this.adminRepository.delete(parseInt(id), transaction);

      // Delete associated user
      await User.destroy({
        where: { id: existingAdmin.user_id },
        transaction,
      });

      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to delete admin: ${error.message}`);
    }
  }

  async resetAdminPassword(id) {
    const transaction = await sequelize.transaction();
    
    try {
      if (!id || isNaN(id)) {
        throw new Error('Valid admin ID is required');
      }

      // Check if admin exists
      const existingAdmin = await this.adminRepository.findById(parseInt(id), transaction);
      if (!existingAdmin) {
        throw new Error('Admin not found');
      }

      // Reset password to username
      const hashedPassword = await bcrypt.hash(existingAdmin.username, 10);
      
      await User.update(
        { password: hashedPassword },
        { 
          where: { id: existingAdmin.user_id },
          transaction 
        }
      );

      await transaction.commit();

      return {
        message: 'Password reset successfully',
        username: existingAdmin.username,
        newPassword: existingAdmin.username,
      };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to reset password: ${error.message}`);
    }
  }

  async getAdminByUserId(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const admin = await this.adminRepository.findByUserId(userId);
      
      if (!admin) {
        throw new Error('Admin not found');
      }

      return admin;
    } catch (error) {
      throw new Error(`Failed to get admin by user ID: ${error.message}`);
    }
  }
}

module.exports = AdminUseCase;
