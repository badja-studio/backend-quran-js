const express = require('express');
const surahRoutes = require('./surah.routes');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');

const router = express.Router();

// Health check routes
router.use('/', healthRoutes);

// API v1 routes
router.use('/v1/auth', authRoutes);
router.use('/v1', surahRoutes);

module.exports = router;
