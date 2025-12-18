const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * Dashboard Routes
 * All routes require authentication
 * Simple, lightweight, with 1-hour in-memory cache
 */

// GET /api/dashboard/overview - Get comprehensive dashboard data
router.get('/overview',
    authMiddleware.authenticateToken,
    dashboardController.getDashboardOverview
);

// GET /api/dashboard/statistics - Get basic statistics
router.get('/statistics',
    authMiddleware.authenticateToken,
    dashboardController.getBasicStatistics
);

// GET /api/dashboard/participation - Get participation statistics
router.get('/participation',
    authMiddleware.authenticateToken,
    dashboardController.getParticipationStats
);

// GET /api/dashboard/demographics - Get demographic data
router.get('/demographics',
    authMiddleware.authenticateToken,
    dashboardController.getDemographicData
);

// GET /api/dashboard/performance - Get performance analytics
router.get('/performance',
    authMiddleware.authenticateToken,
    dashboardController.getPerformanceAnalytics
);

// GET /api/dashboard/errors - Get error analysis
router.get('/errors',
    authMiddleware.authenticateToken,
    dashboardController.getErrorAnalysis
);

// GET /api/dashboard/provinces - Get province data
router.get('/provinces',
    authMiddleware.authenticateToken,
    dashboardController.getProvinceData
);

// POST /api/dashboard/clear-cache - Clear dashboard cache (admin only)
router.post('/clear-cache',
    authMiddleware.authenticateToken,
    dashboardController.clearCache
);

module.exports = router;
