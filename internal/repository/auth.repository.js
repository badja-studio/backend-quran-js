const User = require('../models/user.model');

// Validation helpers
const validateEmail = (email) => {
    if (!email) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateUsername = (username) => {
    if (!username || typeof username !== 'string') return false;
    // Username: 3-100 chars, alphanumeric, dots, underscores, hyphens, @
    const usernameRegex = /^[a-zA-Z0-9._@-]{3,100}$/;
    return usernameRegex.test(username);
};

const validatePassword = (password) => {
    if (!password || typeof password !== 'string') return false;
    return password.length >= 6;
};

const validateRole = (role) => {
    const validRoles = ['admin', 'assessor', 'participant'];
    return validRoles.includes(role);
};

class AuthRepository {
    /**
     * Create a new user (legacy - without transaction)
     * @param {Object} userData - User data
     * @returns {Promise<User>}
     */
    async createUser(userData) {
        // Validate input
        this.validateUserData(userData);
        
        // Check if username already exists
        const existingUser = await this.findByUsername(userData.username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Check if email already exists (if provided)
        if (userData.email) {
            const existingEmail = await this.findByEmail(userData.email);
            if (existingEmail) {
                throw new Error('Email already exists');
            }
        }

        // Password will be hashed by model hook beforeCreate
        return await User.create(userData);
    }

    /**
     * Create a new user with transaction support
     * @param {Object} userData - User data
     * @param {Object} transaction - Sequelize transaction
     * @returns {Promise<User>}
     */
    async createUserWithTransaction(userData, transaction) {
        // Validate input
        this.validateUserData(userData);
        
        // Check if username already exists
        const existingUser = await User.findOne({ 
            where: { username: userData.username },
            transaction 
        });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // Check if email already exists (if provided)
        if (userData.email) {
            const existingEmail = await User.findOne({ 
                where: { email: userData.email },
                transaction 
            });
            if (existingEmail) {
                throw new Error('Email already exists');
            }
        }

        // Password will be hashed by model hook beforeCreate
        return await User.create(userData, { transaction });
    }

    /**
     * Validate user data before creation
     * @param {Object} userData - User data to validate
     * @throws {Error} If validation fails
     */
    validateUserData(userData) {
        if (!userData) {
            throw new Error('User data is required');
        }

        if (!userData.username) {
            throw new Error('Username is required');
        }

        if (!validateUsername(userData.username)) {
            throw new Error('Invalid username format. Must be 3-100 characters, alphanumeric with dots, underscores, hyphens, or @');
        }

        if (!userData.password) {
            throw new Error('Password is required');
        }

        if (!validatePassword(userData.password)) {
            throw new Error('Password must be at least 6 characters');
        }

        if (!userData.role) {
            throw new Error('Role is required');
        }

        if (!validateRole(userData.role)) {
            throw new Error('Invalid role. Must be admin, assessor, or participant');
        }

        if (userData.email && !validateEmail(userData.email)) {
            throw new Error('Invalid email format');
        }
    }

    /**
     * Find user by email
     * @param {string} email
     * @param {Object} transaction - Optional transaction
     * @returns {Promise<User|null>}
     */
    async findByEmail(email, transaction = null) {
        const options = { where: { email } };
        if (transaction) options.transaction = transaction;
        return await User.findOne(options);
    }

    /**
     * Find user by username
     * @param {string} username
     * @param {Object} transaction - Optional transaction
     * @returns {Promise<User|null>}
     */
    async findByUsername(username, transaction = null) {
        const options = { where: { username } };
        if (transaction) options.transaction = transaction;
        return await User.findOne(options);
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
     * @param {Object} transaction - Optional transaction
     * @returns {Promise<User|null>}
     */
    async findById(id, transaction = null) {
        const options = {};
        if (transaction) options.transaction = transaction;
        return await User.findByPk(id, options);
    }
}

module.exports = new AuthRepository();
