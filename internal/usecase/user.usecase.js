const userRepository = require('../repository/user.repository');

class UserUseCase {
    /**
     * Get all users with pagination
     * @param {number} page - Page number (1-indexed)
     * @param {number} limit - Number of items per page
     * @param {string} search - Optional search query
     * @returns {Promise<Object>} Paginated users response
     */
    async getAllUsers(page = 1, limit = 10, search = '') {
        try {
            // Validate pagination parameters
            const validatedPage = Math.max(1, parseInt(page) || 1);
            const validatedLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));

            const { rows: users, count: total } = await userRepository.getAllUsers(
                validatedPage,
                validatedLimit,
                search
            );

            const totalPages = Math.ceil(total / validatedLimit);

            return {
                success: true,
                message: 'Users retrieved successfully',
                data: {
                    users,
                    pagination: {
                        total,
                        page: validatedPage,
                        limit: validatedLimit,
                        totalPages,
                        hasNext: validatedPage < totalPages,
                        hasPrevious: validatedPage > 1
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
