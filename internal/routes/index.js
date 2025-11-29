const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const healthRoutes = require('./health.routes');
const participantRoutes = require('./participant.routes');
const assessorRoutes = require('./assessor.routes');
const assessmentRoutes = require('./assessment.routes');
const dashboardRoutes = require('./dashboard.routes');

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/participants', participantRoutes);
router.use('/assessors', assessorRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
