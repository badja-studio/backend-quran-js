const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// User routes - all require authentication
router.get('/', authenticateToken, userController.getAllUsers.bind(userController));
router.get('/:id', authenticateToken, userController.getUserById.bind(userController));
router.put('/:id', authenticateToken, userController.updateUser.bind(userController));
router.delete('/:id', authenticateToken, userController.deleteUser.bind(userController));

module.exports = router;
