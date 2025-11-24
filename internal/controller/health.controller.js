const { sequelize } = require('../../config/database');
const config = require('../../config/config');

class HealthController {
  /**
   * @swagger
   * /api/health:
   *   get:
   *     summary: Health check endpoint
   *     description: Check the health status of the API and database connection
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Service is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Service is healthy
   *                 data:
   *                   type: object
   *                   properties:
   *                     status:
   *                       type: string
   *                       example: ok
   *                     environment:
   *                       type: string
   *                       example: development
   *                     version:
   *                       type: string
   *                       example: 1.0.0
   *                     database:
   *                       type: object
   *                       properties:
   *                         status:
   *                           type: string
   *                           example: connected
   *                         host:
   *                           type: string
   *                           example: postgres
   *                     timestamp:
   *                       type: string
   *                       format: date-time
   *                       example: 2025-11-24T04:23:20.000Z
   *                     uptime:
   *                       type: number
   *                       example: 123.456
   *       503:
   *         description: Service is unhealthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: Service is unhealthy
   *                 data:
   *                   type: object
   *                   properties:
   *                     status:
   *                       type: string
   *                       example: error
   *                     database:
   *                       type: object
   *                       properties:
   *                         status:
   *                           type: string
   *                           example: disconnected
   *                         error:
   *                           type: string
   */
  async checkHealth(req, res) {
    try {
      // Check database connection
      let dbStatus = 'disconnected';
      let dbError = null;

      try {
        await sequelize.authenticate();
        dbStatus = 'connected';
      } catch (error) {
        dbError = error.message;
      }

      const isHealthy = dbStatus === 'connected';

      const healthData = {
        success: isHealthy,
        message: isHealthy ? 'Service is healthy' : 'Service is unhealthy',
        data: {
          status: isHealthy ? 'ok' : 'error',
          environment: config.env,
          version: config.api.version,
          database: {
            status: dbStatus,
            host: config.database.host,
            ...(dbError && { error: dbError })
          },
          timestamp: new Date().toISOString(),
          uptime: process.uptime()
        }
      };

      return res.status(isHealthy ? 200 : 503).json(healthData);
    } catch (error) {
      return res.status(503).json({
        success: false,
        message: 'Service is unhealthy',
        data: {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  /**
   * @swagger
   * /api/health/db:
   *   get:
   *     summary: Database health check
   *     description: Check the database connection and get database information
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Database is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Database is healthy
   *                 data:
   *                   type: object
   *                   properties:
   *                     status:
   *                       type: string
   *                       example: connected
   *                     host:
   *                       type: string
   *                       example: postgres
   *                     database:
   *                       type: string
   *                       example: quran_db
   *                     dialect:
   *                       type: string
   *                       example: postgres
   *       503:
   *         description: Database is unhealthy
   */
  async checkDatabase(req, res) {
    try {
      await sequelize.authenticate();
      
      // Get database version
      const [results] = await sequelize.query('SELECT version()');
      const dbVersion = results[0].version;

      return res.status(200).json({
        success: true,
        message: 'Database is healthy',
        data: {
          status: 'connected',
          host: config.database.host,
          database: config.database.name,
          dialect: config.database.dialect,
          version: dbVersion,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      return res.status(503).json({
        success: false,
        message: 'Database is unhealthy',
        data: {
          status: 'disconnected',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  /**
   * @swagger
   * /api/health/ready:
   *   get:
   *     summary: Readiness check
   *     description: Check if the service is ready to accept requests
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Service is ready
   *       503:
   *         description: Service is not ready
   */
  async checkReadiness(req, res) {
    try {
      // Check if database is ready
      await sequelize.authenticate();
      
      return res.status(200).json({
        success: true,
        message: 'Service is ready',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(503).json({
        success: false,
        message: 'Service is not ready',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * @swagger
   * /api/health/live:
   *   get:
   *     summary: Liveness check
   *     description: Check if the service is alive (basic health check without dependencies)
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Service is alive
   */
  async checkLiveness(req, res) {
    return res.status(200).json({
      success: true,
      message: 'Service is alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }
}

module.exports = new HealthController();
