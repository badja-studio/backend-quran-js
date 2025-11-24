const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');

// Authentication routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/refresh', authController.refreshToken.bind(authController));

module.exports = router;
