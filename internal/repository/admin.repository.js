const { Admin, User } = require('../models');
const { Op } = require('sequelize');

class AdminRepository {
  async create(adminData, transaction = null) {
    try {
      const admin = await Admin.create(adminData, {
        transaction,
      });
      
      // Return with user details
      return await this.findById(admin.id, transaction);
    } catch (error) {
      throw new Error(`Failed to create admin: ${error.message}`);
    }
  }

  async findAll({
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'created_at',
    sortOrder = 'DESC',
    filters = []
  } = {}) {
    try {
      const offset = (page - 1) * limit;
      const whereConditions = {};
      const userWhereConditions = {};

      // Handle search
      if (search) {
        const searchConditions = {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { username: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            { phone: { [Op.iLike]: `%${search}%` } },
          ],
        };
        Object.assign(whereConditions, searchConditions);
      }

      // Handle filters
      if (filters && filters.length > 0) {
        filters.forEach(filter => {
          const { field, op, value } = filter;
          
          // Map operators
          const operatorMap = {
            eq: Op.eq,
            ne: Op.ne,
            gt: Op.gt,
            gte: Op.gte,
            lt: Op.lt,
            lte: Op.lte,
            contains: Op.iLike,
            startsWith: Op.iLike,
            endsWith: Op.iLike,
            in: Op.in,
            between: Op.between,
          };

          const sequelizeOp = operatorMap[op] || Op.eq;
          let filterValue = value;

          if (op === 'contains') {
            filterValue = `%${value}%`;
          } else if (op === 'startsWith') {
            filterValue = `${value}%`;
          } else if (op === 'endsWith') {
            filterValue = `%${value}`;
          }

          // Apply filter to appropriate table
          if (['name', 'username', 'email', 'phone'].includes(field)) {
            whereConditions[field] = { [sequelizeOp]: filterValue };
          } else if (['role'].includes(field)) {
            userWhereConditions[field] = { [sequelizeOp]: filterValue };
          }
        });
      }

      const { count, rows } = await Admin.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: User,
            as: 'user',
            where: Object.keys(userWhereConditions).length > 0 ? userWhereConditions : undefined,
            attributes: ['id', 'role', 'is_active', 'last_login', 'created_at'],
          },
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]],
        distinct: true,
      });

      const totalPages = Math.ceil(count / limit);

      return {
        data: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          limit: parseInt(limit),
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch admins: ${error.message}`);
    }
  }

  async findById(id, transaction = null) {
    try {
      const admin = await Admin.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'role', 'is_active', 'last_login', 'created_at'],
          },
        ],
        transaction,
      });

      if (!admin) {
        throw new Error('Admin not found');
      }

      return admin;
    } catch (error) {
      throw new Error(`Failed to fetch admin: ${error.message}`);
    }
  }

  async findByUsername(username, transaction = null) {
    try {
      const admin = await Admin.findOne({
        where: { username },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'role', 'is_active', 'last_login'],
          },
        ],
        transaction,
      });

      return admin;
    } catch (error) {
      throw new Error(`Failed to find admin by username: ${error.message}`);
    }
  }

  async findByEmail(email, transaction = null) {
    try {
      const admin = await Admin.findOne({
        where: { email },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'role', 'is_active', 'last_login'],
          },
        ],
        transaction,
      });

      return admin;
    } catch (error) {
      throw new Error(`Failed to find admin by email: ${error.message}`);
    }
  }

  async findByUserId(userId, transaction = null) {
    try {
      const admin = await Admin.findOne({
        where: { user_id: userId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'role', 'is_active', 'last_login'],
          },
        ],
        transaction,
      });

      return admin;
    } catch (error) {
      throw new Error(`Failed to find admin by user ID: ${error.message}`);
    }
  }

  async update(id, updateData, transaction = null) {
    try {
      const admin = await Admin.findByPk(id, { transaction });
      
      if (!admin) {
        throw new Error('Admin not found');
      }

      await admin.update(updateData, { transaction });
      
      return await this.findById(id, transaction);
    } catch (error) {
      throw new Error(`Failed to update admin: ${error.message}`);
    }
  }

  async delete(id, transaction = null) {
    try {
      const admin = await Admin.findByPk(id, { transaction });
      
      if (!admin) {
        throw new Error('Admin not found');
      }

      await admin.destroy({ transaction });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete admin: ${error.message}`);
    }
  }

  async checkUsernameExists(username, excludeId = null, transaction = null) {
    try {
      const whereConditions = { username };
      
      if (excludeId) {
        whereConditions.id = { [Op.ne]: excludeId };
      }

      const admin = await Admin.findOne({
        where: whereConditions,
        transaction,
      });

      return !!admin;
    } catch (error) {
      throw new Error(`Failed to check username: ${error.message}`);
    }
  }

  async checkEmailExists(email, excludeId = null, transaction = null) {
    try {
      const whereConditions = { email };
      
      if (excludeId) {
        whereConditions.id = { [Op.ne]: excludeId };
      }

      const admin = await Admin.findOne({
        where: whereConditions,
        transaction,
      });

      return !!admin;
    } catch (error) {
      throw new Error(`Failed to check email: ${error.message}`);
    }
  }
}

module.exports = AdminRepository;
