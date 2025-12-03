const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const { User, Assessor, Participant } = require('../models');

class AuthUsecase {
  async register(userData) {
    try {
      const { username, password, role } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return {
          success: false,
          statusCode: 400,
          message: 'Username already exists'
        };
      }

      // Create user (password will be hashed by model hook)
      const user = await User.create({
        username,
        password,
        role
      });

      // Generate token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.accessExpiresIn }
      );

      return {
        success: true,
        statusCode: 201,
        message: 'User registered successfully',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: error.message
      };
    }
  }

  async login(loginData) {
    try {
      const { username, password } = loginData;

      if (!username || !password) {
        return {
          success: false,
          statusCode: 400,
          message: 'Username and password are required'
        };
      }

      // Find user
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return {
          success: false,
          statusCode: 401,
          message: 'Invalid credentials'
        };
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return {
          success: false,
          statusCode: 401,
          message: 'Invalid credentials'
        };
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.accessExpiresIn }
      );

      return {
        success: true,
        statusCode: 200,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: error.message
      };
    }
  }

  async refreshToken(refreshToken) {
    try {
      if (!refreshToken) {
        return {
          success: false,
          statusCode: 400,
          message: 'Refresh token is required'
        };
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.secret);
      
      // Get user
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return {
          success: false,
          statusCode: 401,
          message: 'User not found'
        };
      }

      // Generate new token
      const newToken = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.accessExpiresIn }
      );

      return {
        success: true,
        statusCode: 200,
        message: 'Token refreshed successfully',
        data: {
          token: newToken,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        }
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return {
          success: false,
          statusCode: 401,
          message: 'Refresh token has expired'
        };
      }

      return {
        success: false,
        statusCode: 500,
        message: error.message
      };
    }
  }
}

module.exports = new AuthUsecase();
