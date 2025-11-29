const dashboardUseCase = require('../usecase/dashboard.usecase');

class DashboardController {
    // GET /api/dashboard/overview
    async getDashboardOverview(req, res) {
        try {
            const data = await dashboardUseCase.getDashboardOverview();
            
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
            const data = await dashboardUseCase.getBasicStatistics();
            
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
            const data = await dashboardUseCase.getParticipationStats();
            
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
            const data = await dashboardUseCase.getDemographicData();
            
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
            const data = await dashboardUseCase.getPerformanceAnalytics();
            
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
            const data = await dashboardUseCase.getErrorAnalysis();
            
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
            const data = await dashboardUseCase.getProvinceData();
            
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
