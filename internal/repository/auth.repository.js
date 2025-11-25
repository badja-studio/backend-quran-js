const User = require('../models/user.model');

class AuthRepository {
    /**
     * Create a new user
     * @param {Object} userData - User data
     * @returns {Promise<User>}
     */
    async createUser(userData) {
        return await User.create(userData);
    }

    /**
     * Find user by email
     * @param {string} email
     * @returns {Promise<User|null>}
     */
    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    /**
     * Find user by username
     * @param {string} username
     * @returns {Promise<User|null>}
     */
    async findByUsername(username) {
        return await User.findOne({ where: { username } });
    }

    /**
     * Find user by siagaNumber
     * @param {string} siagaNumber
     * @returns {Promise<User|null>}
     */
    async findBySiagaNumber(siagaNumber) {
        return await User.findOne({ where: { siagaNumber } });
    }

    /**
     * Find user by ID
     * @param {string} id
     * @returns {Promise<User|null>}
     */
    async findById(id) {
        return await User.findByPk(id);
    }
}

module.exports = new AuthRepository();
