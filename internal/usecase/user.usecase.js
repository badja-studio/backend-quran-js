const userRepository = require('../repository/user.repository');

class UserUseCase {
    /**
     * Get all users with pagination, search and sorting
     * @param {number} page - Page number (1-indexed)
     * @param {number} limit - Number of items per page
     * @param {string} search - Optional search query
     * @param {string} sortBy - Field to sort by
     * @param {string} sortOrder - Sort order (ASC or DESC)
     * @returns {Promise<Object>} Paginated users response
     */
    async getAllUsers(page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'DESC') {
        try {
            const { User } = require('../models');
            const { Op } = require('sequelize');
            
            const offset = (page - 1) * limit;
            const parsedLimit = parseInt(limit);
            const currentPage = parseInt(page);

            // Build search conditions
            const searchConditions = search ? {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { fullname: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } },
                    { username: { [Op.iLike]: `%${search}%` } },
                    { siagaNumber: { [Op.iLike]: `%${search}%` } },
                    { accountNumber: { [Op.iLike]: `%${search}%` } },
                    { nip: { [Op.iLike]: `%${search}%` } }
                ]
            } : {};

            const { count, rows } = await User.findAndCountAll({
                where: searchConditions,
                attributes: { exclude: ['password'] },
                limit: parsedLimit,
                offset: offset,
                order: [[sortBy, sortOrder.toUpperCase()]],
                distinct: true
            });

            const totalPages = Math.ceil(count / parsedLimit);

            return {
                success: true,
                message: 'Users retrieved successfully',
                data: {
                    users: rows,
                    pagination: {
                        total: count,
                        page: currentPage,
                        limit: parsedLimit,
                        totalPages,
                        hasNext: currentPage < totalPages,
                        hasPrevious: currentPage > 1
                    }
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Get user by ID
     * @param {string} id - User ID
     * @returns {Promise<Object>} User response
     */
    async getUserById(id) {
        try {
            const user = await userRepository.getUserById(id);

            if (!user) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }

            return {
                success: true,
                message: 'User retrieved successfully',
                data: { user }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Update user
     * @param {string} id - User ID
     * @param {Object} data - Update data
     * @returns {Promise<Object>} Update response
     */
    async updateUser(id, data) {
        try {
            const user = await userRepository.updateUser(id, data);

            if (!user) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }

            return {
                success: true,
                message: 'User updated successfully',
                data: { user }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Delete user
     * @param {string} id - User ID
     * @returns {Promise<Object>} Delete response
     */
    async deleteUser(id) {
        try {
            const deleted = await userRepository.deleteUser(id);

            if (!deleted) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }

            return {
                success: true,
                message: 'User deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

module.exports = new UserUseCase();
