const express = require('express');
const surahRoutes = require('./surah.routes');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');
const assessorRoutes = require('./assessor.routes');
const assesseeRoutes = require('./assessee.routes');
const { authenticateToken, isAdmin, isAssessor, isAssessee } = require('../middleware/auth.middleware');

const router = express.Router();

// Health check routes
router.use('/', healthRoutes);

// API v1 routes
router.use('/v1/auth', authRoutes);
router.use('/v1/users', userRoutes);
router.use('/v1/admin', authenticateToken, isAdmin, adminRoutes);
router.use('/v1/assessor', authenticateToken, isAssessor, assessorRoutes);
router.use('/v1/assessee', authenticateToken, isAssessee, assesseeRoutes);

// Legacy routes (keep for backwards compatibility)
router.use('/v1', surahRoutes);

module.exports = router;
