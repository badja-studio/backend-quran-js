const dashboardUseCase = require('../usecase/dashboard.usecase');

/**
 * Simplified Dashboard Controller
 * - Simple in-memory cache (no Redis)
 * - Auto invalidate after 1 hour
 * - Direct, lightweight, no blocking
 */

// Simple in-memory cache with 1 hour TTL
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

// Helper to get cached data or fetch new
async function getCachedData(key, fetchFunction) {
    const now = Date.now();
    const cached = cache.get(key);

    // Return cached data if valid (within 1 hour)
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
        return cached.data;
    }

    // Fetch fresh data
    const data = await fetchFunction();
    cache.set(key, { data, timestamp: now });

    return data;
}

class DashboardController {
    // GET /api/dashboard/overview?provinsi={name}
    async getDashboardOverview(req, res) {
        try {
            const provinsi = req.query.provinsi || null;
            const cacheKey = provinsi
                ? `dashboard:overview:${provinsi.toUpperCase().replace(/\s+/g, '_')}`
                : 'dashboard:overview';

            const data = await getCachedData(
                cacheKey,
                () => dashboardUseCase.getDashboardOverview(provinsi)
            );

            res.status(200).json({
                success: true,
                message: 'Dashboard overview retrieved successfully',
                data
            });
        } catch (error) {
            console.error('Error in getDashboardOverview:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve dashboard overview'
            });
        }
    }

    // GET /api/dashboard/statistics?provinsi={name}
    async getBasicStatistics(req, res) {
        try {
            const provinsi = req.query.provinsi || null;
            const cacheKey = provinsi
                ? `dashboard:statistics:${provinsi.toUpperCase().replace(/\s+/g, '_')}`
                : 'dashboard:statistics';

            const data = await getCachedData(
                cacheKey,
                () => dashboardUseCase.getBasicStatistics(provinsi)
            );

            res.status(200).json({
                success: true,
                message: 'Basic statistics retrieved successfully',
                data
            });
        } catch (error) {
            console.error('Error in getBasicStatistics:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve basic statistics'
            });
        }
    }

    // GET /api/dashboard/participation?provinsi={name}
    async getParticipationStats(req, res) {
        try {
            const provinsi = req.query.provinsi || null;
            const cacheKey = provinsi
                ? `dashboard:participation:${provinsi.toUpperCase().replace(/\s+/g, '_')}`
                : 'dashboard:participation';

            const data = await getCachedData(
                cacheKey,
                () => dashboardUseCase.getParticipationStats(provinsi)
            );

            res.status(200).json({
                success: true,
                message: 'Participation statistics retrieved successfully',
                data
            });
        } catch (error) {
            console.error('Error in getParticipationStats:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve participation statistics'
            });
        }
    }

    // GET /api/dashboard/demographics?provinsi={name}
    async getDemographicData(req, res) {
        try {
            const provinsi = req.query.provinsi || null;
            const cacheKey = provinsi
                ? `dashboard:demographics:${provinsi.toUpperCase().replace(/\s+/g, '_')}`
                : 'dashboard:demographics';

            const data = await getCachedData(
                cacheKey,
                () => dashboardUseCase.getDemographicData(provinsi)
            );

            res.status(200).json({
                success: true,
                message: 'Demographic data retrieved successfully',
                data
            });
        } catch (error) {
            console.error('Error in getDemographicData:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve demographic data'
            });
        }
    }

    // GET /api/dashboard/performance?provinsi={name}
    async getPerformanceAnalytics(req, res) {
        try {
            const provinsi = req.query.provinsi || null;
            const cacheKey = provinsi
                ? `dashboard:performance:${provinsi.toUpperCase().replace(/\s+/g, '_')}`
                : 'dashboard:performance';

            const data = await getCachedData(
                cacheKey,
                () => dashboardUseCase.getPerformanceAnalytics(provinsi)
            );

            res.status(200).json({
                success: true,
                message: 'Performance analytics retrieved successfully',
                data
            });
        } catch (error) {
            console.error('Error in getPerformanceAnalytics:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve performance analytics'
            });
        }
    }

    // GET /api/dashboard/errors?provinsi={name}
    async getErrorAnalysis(req, res) {
        try {
            const provinsi = req.query.provinsi || null;
            const cacheKey = provinsi
                ? `dashboard:errors:${provinsi.toUpperCase().replace(/\s+/g, '_')}`
                : 'dashboard:errors';

            const data = await getCachedData(
                cacheKey,
                () => dashboardUseCase.getErrorAnalysis(provinsi)
            );

            res.status(200).json({
                success: true,
                message: 'Error analysis retrieved successfully',
                data
            });
        } catch (error) {
            console.error('Error in getErrorAnalysis:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve error analysis'
            });
        }
    }

    // GET /api/dashboard/provinces?provinsi={name}
    async getProvinceData(req, res) {
        try {
            const provinsi = req.query.provinsi || null;
            const cacheKey = provinsi
                ? `dashboard:provinces:${provinsi.toUpperCase().replace(/\s+/g, '_')}`
                : 'dashboard:provinces';

            const data = await getCachedData(
                cacheKey,
                () => dashboardUseCase.getProvinceData(provinsi)
            );

            res.status(200).json({
                success: true,
                message: 'Province data retrieved successfully',
                data
            });
        } catch (error) {
            console.error('Error in getProvinceData:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve province data'
            });
        }
    }

    // ============================================================================
    // NEW ENDPOINTS FOR SCORE DISTRIBUTION FEATURE
    // ============================================================================

    // GET /api/dashboard/provinces-list
    async getProvincesList(req, res) {
        try {
            const cacheKey = 'dashboard:provinces-list';

            const data = await getCachedData(
                cacheKey,
                () => dashboardUseCase.getProvincesList()
            );

            res.status(200).json({
                success: true,
                message: 'Provinces list retrieved successfully',
                data
            });
        } catch (error) {
            console.error('Error in getProvincesList:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve provinces list'
            });
        }
    }

    // GET /api/dashboard/score-distribution-by-level?provinsi={name}
    async getScoreDistributionByLevel(req, res) {
        try {
            const provinsi = req.query.provinsi || null;
            const cacheKey = provinsi
                ? `dashboard:score-dist-level:${provinsi.toUpperCase().replace(/\s+/g, '_')}`
                : 'dashboard:score-dist-level';

            const data = await getCachedData(
                cacheKey,
                () => dashboardUseCase.getScoreDistributionByLevel(provinsi)
            );

            res.status(200).json({
                success: true,
                message: 'Score distribution by level retrieved successfully',
                data
            });
        } catch (error) {
            console.error('Error in getScoreDistributionByLevel:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve score distribution by level'
            });
        }
    }

    // GET /api/dashboard/score-distribution-by-subject?provinsi={name}
    async getScoreDistributionBySubject(req, res) {
        try {
            const provinsi = req.query.provinsi || null;
            const cacheKey = provinsi
                ? `dashboard:score-dist-subject:${provinsi.toUpperCase().replace(/\s+/g, '_')}`
                : 'dashboard:score-dist-subject';

            const data = await getCachedData(
                cacheKey,
                () => dashboardUseCase.getScoreDistributionBySubject(provinsi)
            );

            res.status(200).json({
                success: true,
                message: 'Score distribution by subject retrieved successfully',
                data
            });
        } catch (error) {
            console.error('Error in getScoreDistributionBySubject:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve score distribution by subject'
            });
        }
    }

    // Clear cache manually (optional endpoint for admin)
    clearCache(req, res) {
        cache.clear();
        res.status(200).json({
            success: true,
            message: 'Dashboard cache cleared successfully'
        });
    }
}

module.exports = new DashboardController();
