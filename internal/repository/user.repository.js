const User = require('../models/user.model');
const { Op } = require('sequelize');

class UserRepository {
    /**
     * Get all users with pagination and search
     * @param {number} page - Page number (1-indexed)
     * @param {number} limit - Number of items per page
     * @param {string} search - Optional search query
     * @returns {Promise<{rows: User[], count: number}>}
     */
    async getAllUsers(page = 1, limit = 10, search = '') {
        const offset = (page - 1) * limit;

        const whereClause = search ? {
            [Op.or]: [
                { email: { [Op.iLike]: `%${search}%` } },
                { username: { [Op.iLike]: `%${search}%` } },
                { name: { [Op.iLike]: `%${search}%` } },
                { fullname: { [Op.iLike]: `%${search}%` } },
                { siagaNumber: { [Op.iLike]: `%${search}%` } }
            ]
        } : {};

        return await User.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['password'] }
        });
    }

    /**
     * Get user by ID
     * @param {string} id - User ID
     * @returns {Promise<User|null>}
     */
    async getUserById(id) {
        return await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
    }

    /**
     * Update user
     * @param {string} id - User ID
     * @param {Object} data - Update data
     * @returns {Promise<User|null>}
     */
    async updateUser(id, data) {
        const user = await User.findByPk(id);
        if (!user) {
            return null;
        }

        // Don't allow updating email, username, or siagaNumber if they're already taken by another user
        if (data.email && data.email !== user.email) {
            const existingEmail = await User.findOne({ where: { email: data.email } });
            if (existingEmail) {
                throw new Error('Email already in use');
            }
        }

        if (data.username && data.username !== user.username) {
            const existingUsername = await User.findOne({ where: { username: data.username } });
            if (existingUsername) {
                throw new Error('Username already in use');
            }
        }

        if (data.siagaNumber && data.siagaNumber !== user.siagaNumber) {
            const existingSiagaNumber = await User.findOne({ where: { siagaNumber: data.siagaNumber } });
            if (existingSiagaNumber) {
                throw new Error('Siaga number already in use');
            }
        }

        await user.update(data);
        return user;
    }

    /**
     * Delete user (soft delete by setting a deletedAt field or actual delete)
     * @param {string} id - User ID
     * @returns {Promise<boolean>}
     */
    async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) {
            return false;
        }
        await user.destroy();
        return true;
    }
}

module.exports = new UserRepository();
