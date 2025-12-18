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
    // GET /api/dashboard/overview
    async getDashboardOverview(req, res) {
        try {
            const data = await getCachedData(
                'dashboard:overview',
                () => dashboardUseCase.getDashboardOverview()
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

    // GET /api/dashboard/statistics
    async getBasicStatistics(req, res) {
        try {
            const data = await getCachedData(
                'dashboard:statistics',
                () => dashboardUseCase.getBasicStatistics()
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

    // GET /api/dashboard/participation
    async getParticipationStats(req, res) {
        try {
            const data = await getCachedData(
                'dashboard:participation',
                () => dashboardUseCase.getParticipationStats()
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

    // GET /api/dashboard/demographics
    async getDemographicData(req, res) {
        try {
            const data = await getCachedData(
                'dashboard:demographics',
                () => dashboardUseCase.getDemographicData()
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

    // GET /api/dashboard/performance
    async getPerformanceAnalytics(req, res) {
        try {
            const data = await getCachedData(
                'dashboard:performance',
                () => dashboardUseCase.getPerformanceAnalytics()
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

    // GET /api/dashboard/errors
    async getErrorAnalysis(req, res) {
        try {
            const data = await getCachedData(
                'dashboard:errors',
                () => dashboardUseCase.getErrorAnalysis()
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

    // GET /api/dashboard/provinces
    async getProvinceData(req, res) {
        try {
            const data = await getCachedData(
                'dashboard:provinces',
                () => dashboardUseCase.getProvinceData()
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
