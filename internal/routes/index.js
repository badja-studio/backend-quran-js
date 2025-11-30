const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const healthRoutes = require('./health.routes');
const participantRoutes = require('./participant.routes');
const assessorRoutes = require('./assessor.routes');
const assessmentRoutes = require('./assessment.routes');
const dashboardRoutes = require('./dashboard.routes');
const exportRoutes = require('./export.routes');
const adminRoutes = require('./admin.routes');
const masterRoutes = require('./master.routes');
const { authLimiter, apiLimiter, masterDataLimiter } = require('../middleware/rateLimiter.middleware');

// Apply specific rate limiters
router.use('/auth', authLimiter, authRoutes);
router.use('/health', healthRoutes); // No rate limit for health check
router.use('/participants', apiLimiter, participantRoutes);
router.use('/assessors', apiLimiter, assessorRoutes);
router.use('/assessments', apiLimiter, assessmentRoutes);
router.use('/dashboard', apiLimiter, dashboardRoutes);
router.use('/export', apiLimiter, exportRoutes);
router.use('/admins', apiLimiter, adminRoutes);
router.use('/master', masterDataLimiter, masterRoutes);

module.exports = router;
