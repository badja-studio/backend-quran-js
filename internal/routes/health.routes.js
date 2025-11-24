const express = require('express');
const healthController = require('../controller/health.controller');

const router = express.Router();

// Health check routes
router.get('/health', healthController.checkHealth.bind(healthController));
router.get('/health/db', healthController.checkDatabase.bind(healthController));
router.get('/health/ready', healthController.checkReadiness.bind(healthController));
router.get('/health/live', healthController.checkLiveness.bind(healthController));

module.exports = router;
