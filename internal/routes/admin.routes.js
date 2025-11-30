const express = require('express');
const AdminController = require('../controller/admin.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();
const adminController = new AdminController();

// Apply authentication middleware to all admin routes
router.use(authenticateToken);

// Admin routes
router.post('/', adminController.createAdmin.bind(adminController));
router.get('/', adminController.getAllAdmins.bind(adminController));
router.get('/:id', adminController.getAdminById.bind(adminController));
router.post('/:id/reset-password', adminController.resetPassword.bind(adminController));

module.exports = router;
