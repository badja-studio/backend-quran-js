/**
 * Health Controller
 * Simple health check endpoint
 */
class HealthController {
    /**
     * Check application health status
     */
    async healthCheck(req, res) {
        try {
            const healthData = {
                status: 'OK',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development',
                version: '1.0.0'
            };

            return res.status(200).json({
                success: true,
                message: 'Server is healthy',
                data: healthData
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Health check failed',
                error: error.message
            });
        }
    }

    /**
     * Check database connection health
     */
    async databaseCheck(req, res) {
        try {
            const { sequelize } = require('../models');
            
            // Test database connection
            await sequelize.authenticate();

            return res.status(200).json({
                success: true,
                message: 'Database connection is healthy',
                data: {
                    status: 'Connected',
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Database connection failed',
                error: error.message
            });
        }
    }
}

module.exports = new HealthController();
