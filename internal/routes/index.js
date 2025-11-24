const express = require('express');
const surahRoutes = require('./surah.routes');

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Service is healthy',
    timestamp: new Date().toISOString()
  });
});

// API v1 routes
router.use('/v1', surahRoutes);

module.exports = router;
