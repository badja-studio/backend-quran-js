const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Authentication routes (no auth required)
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/refresh', (req, res) => authController.refreshToken(req, res));

// Protected routes (auth required)
router.get('/me', authenticateToken, (req, res) => authController.getProfile(req, res));

module.exports = router;
