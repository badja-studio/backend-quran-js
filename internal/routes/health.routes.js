const express = require('express');
const healthController = require('../controller/health.controller');

const router = express.Router();

// Health check routes
router.get('/', (req, res) => healthController.healthCheck(req, res));
router.get('/db', (req, res) => healthController.databaseCheck(req, res));

module.exports = router;
