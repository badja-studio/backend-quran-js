const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const authRepository = require('../repository/auth.repository');

class AuthUseCase {
    /**
     * Generate access token
     * @param {Object} user - User object
     * @returns {string} Access token
     */
    generateAccessToken(user) {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                roles: user.roles
            },
            config.jwt.secret,
            { expiresIn: config.jwt.accessExpiresIn }
        );
    }

    /**
     * Generate refresh token
     * @param {Object} user - User object
     * @returns {string} Refresh token
     */
    generateRefreshToken(user) {
        return jwt.sign(
            {
                id: user.id,
                type: 'refresh'
            },
            config.jwt.refreshSecret,
            { expiresIn: config.jwt.refreshExpiresIn }
        );
    }

    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Registered user and tokens
     */
    async register(userData) {
        try {
            // Validate required fields
            const { email, password, username, name, fullname, roles } = userData;

            if (!email || !password || !username || !name || !fullname) {
                throw new Error('All fields are required: email, password, username, name, fullname');
            }

            // Validate role
            const validRoles = ['Admin', 'Teacher', 'Student'];
            if (roles && !validRoles.includes(roles)) {
                throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
            }

            // Check if email already exists
            const existingEmail = await authRepository.findByEmail(email);
            if (existingEmail) {
                throw new Error('Email already registered');
            }

            // Check if username already exists
            const existingUsername = await authRepository.findByUsername(username);
            if (existingUsername) {
                throw new Error('Username already taken');
            }

            // Create user
            const user = await authRepository.createUser({
                email,
                password,
                username,
                name,
                fullname,
                roles: roles || 'Student'
            });

            // Generate tokens
            const authToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);

            return {
                success: true,
                message: 'User registered successfully',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        name: user.name,
                        fullname: user.fullname,
                        roles: user.roles
                    },
                    token: authToken, // For compatibility
                    authToken,
                    refreshToken
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
     * Login user
     * @param {Object} credentials - Login credentials (email/username and password)
     * @returns {Promise<Object>} Login result with tokens
     */
    async login(credentials) {
        try {
            const { emailOrUsername, password } = credentials;

            if (!emailOrUsername || !password) {
                throw new Error('Email/Username and password are required');
            }

            // Find user by email or username
            let user = await authRepository.findByEmail(emailOrUsername);
            if (!user) {
                user = await authRepository.findByUsername(emailOrUsername);
            }

            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Verify password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            // Generate tokens
            const authToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);

            return {
                success: true,
                message: 'Login successful',
                data: {
                    token: authToken, // For compatibility
                    name: user.name,
                    roles: user.roles,
                    authToken,
                    refreshToken
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
     * Refresh access token
     * @param {string} refreshToken - Refresh token
     * @returns {Promise<Object>} New access token
     */
    async refreshToken(refreshToken) {
        try {
            if (!refreshToken) {
                throw new Error('Refresh token is required');
            }

            // Verify refresh token
            const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);

            if (decoded.type !== 'refresh') {
                throw new Error('Invalid token type');
            }

            // Get user
            const user = await authRepository.findById(decoded.id);
            if (!user) {
                throw new Error('User not found');
            }

            // Generate new access token
            const newAuthToken = this.generateAccessToken(user);

            return {
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    authToken: newAuthToken,
                    token: newAuthToken // For compatibility
                }
            };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return {
                    success: false,
                    message: 'Refresh token has expired'
                };
            }

            if (error.name === 'JsonWebTokenError') {
                return {
                    success: false,
                    message: 'Invalid refresh token'
                };
            }

            return {
                success: false,
                message: error.message
            };
        }
    }
}

module.exports = new AuthUseCase();
