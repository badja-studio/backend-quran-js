const dashboardUseCase = require('../usecase/dashboard.usecase');
const redisManager = require('../../config/redis');

class DashboardController {
    // GET /api/dashboard/overview
    async getDashboardOverview(req, res) {
        try {
            let data;
            const cacheKey = 'quran:dashboard:overview:v1';

            // Try cache first if Redis is connected
            if (redisManager.isConnected) {
                try {
                    const redis = redisManager.getCacheClient();
                    const cached = await redis.get(cacheKey);

                    if (cached) {
                        data = JSON.parse(cached);
                        res.setHeader('X-Cache', 'HIT');
                        console.log('[Cache] Dashboard overview - HIT');
                    }
                } catch (error) {
                    console.warn('[Cache] Redis read failed for dashboard overview, falling back to DB:', error.message);
                }
            }

            // Fallback to DB if cache miss or Redis unavailable
            if (!data) {
                data = await dashboardUseCase.getDashboardOverview();
                res.setHeader('X-Cache', 'MISS');
                console.log('[Cache] Dashboard overview - MISS');
            }

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
            let data;
            const cacheKey = 'quran:dashboard:statistics:v1';

            // Try cache first if Redis is connected
            if (redisManager.isConnected) {
                try {
                    const redis = redisManager.getCacheClient();
                    const cached = await redis.get(cacheKey);

                    if (cached) {
                        data = JSON.parse(cached);
                        res.setHeader('X-Cache', 'HIT');
                        console.log('[Cache] Basic statistics - HIT');
                    }
                } catch (error) {
                    console.warn('[Cache] Redis read failed for basic statistics, falling back to DB:', error.message);
                }
            }

            // Fallback to DB if cache miss or Redis unavailable
            if (!data) {
                data = await dashboardUseCase.getBasicStatistics();
                res.setHeader('X-Cache', 'MISS');
                console.log('[Cache] Basic statistics - MISS');
            }

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
            let data;
            const cacheKey = 'quran:dashboard:participation:v1';

            // Try cache first if Redis is connected
            if (redisManager.isConnected) {
                try {
                    const redis = redisManager.getCacheClient();
                    const cached = await redis.get(cacheKey);

                    if (cached) {
                        data = JSON.parse(cached);
                        res.setHeader('X-Cache', 'HIT');
                        console.log('[Cache] Participation stats - HIT');
                    }
                } catch (error) {
                    console.warn('[Cache] Redis read failed for participation stats, falling back to DB:', error.message);
                }
            }

            // Fallback to DB if cache miss or Redis unavailable
            if (!data) {
                data = await dashboardUseCase.getParticipationStats();
                res.setHeader('X-Cache', 'MISS');
                console.log('[Cache] Participation stats - MISS');
            }

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
            let data;
            const cacheKey = 'quran:dashboard:demographics:v1';

            // Try cache first if Redis is connected
            if (redisManager.isConnected) {
                try {
                    const redis = redisManager.getCacheClient();
                    const cached = await redis.get(cacheKey);

                    if (cached) {
                        data = JSON.parse(cached);
                        res.setHeader('X-Cache', 'HIT');
                        console.log('[Cache] Demographics - HIT');
                    }
                } catch (error) {
                    console.warn('[Cache] Redis read failed for demographics, falling back to DB:', error.message);
                }
            }

            // Fallback to DB if cache miss or Redis unavailable
            if (!data) {
                data = await dashboardUseCase.getDemographicData();
                res.setHeader('X-Cache', 'MISS');
                console.log('[Cache] Demographics - MISS');
            }

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
            let data;
            const cacheKey = 'quran:dashboard:performance:v1';

            // Try cache first if Redis is connected
            if (redisManager.isConnected) {
                try {
                    const redis = redisManager.getCacheClient();
                    const cached = await redis.get(cacheKey);

                    if (cached) {
                        data = JSON.parse(cached);
                        res.setHeader('X-Cache', 'HIT');
                        console.log('[Cache] Performance analytics - HIT');
                    }
                } catch (error) {
                    console.warn('[Cache] Redis read failed for performance analytics, falling back to DB:', error.message);
                }
            }

            // Fallback to DB if cache miss or Redis unavailable
            if (!data) {
                data = await dashboardUseCase.getPerformanceAnalytics();
                res.setHeader('X-Cache', 'MISS');
                console.log('[Cache] Performance analytics - MISS');
            }

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
            let data;
            const cacheKey = 'quran:dashboard:errors:v1';

            // Try cache first if Redis is connected
            if (redisManager.isConnected) {
                try {
                    const redis = redisManager.getCacheClient();
                    const cached = await redis.get(cacheKey);

                    if (cached) {
                        data = JSON.parse(cached);
                        res.setHeader('X-Cache', 'HIT');
                        console.log('[Cache] Error analysis - HIT');
                    }
                } catch (error) {
                    console.warn('[Cache] Redis read failed for error analysis, falling back to DB:', error.message);
                }
            }

            // Fallback to DB if cache miss or Redis unavailable
            if (!data) {
                data = await dashboardUseCase.getErrorAnalysis();
                res.setHeader('X-Cache', 'MISS');
                console.log('[Cache] Error analysis - MISS');
            }

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
            let data;
            const cacheKey = 'quran:dashboard:provinces:v1';

            // Try cache first if Redis is connected
            if (redisManager.isConnected) {
                try {
                    const redis = redisManager.getCacheClient();
                    const cached = await redis.get(cacheKey);

                    if (cached) {
                        data = JSON.parse(cached);
                        res.setHeader('X-Cache', 'HIT');
                        console.log('[Cache] Province data - HIT');
                    }
                } catch (error) {
                    console.warn('[Cache] Redis read failed for province data, falling back to DB:', error.message);
                }
            }

            // Fallback to DB if cache miss or Redis unavailable
            if (!data) {
                data = await dashboardUseCase.getProvinceData();
                res.setHeader('X-Cache', 'MISS');
                console.log('[Cache] Province data - MISS');
            }

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
}

module.exports = new DashboardController();
