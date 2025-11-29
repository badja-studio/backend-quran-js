/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check application health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
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
 *                   example: "Server is healthy"
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "OK"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     uptime:
 *                       type: number
 *                       example: 123.456
 *                     environment:
 *                       type: string
 *                       example: "development"
 *                     version:
 *                       type: string
 *                       example: "1.0.0"
 *       500:
 *         description: Health check failed
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
 *                   example: "Health check failed"
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /api/health/db:
 *   get:
 *     summary: Check database connection health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Database connection is healthy
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
 *                   example: "Database connection is healthy"
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "Connected"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Database connection failed
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
 *                   example: "Database connection failed"
 *                 error:
 *                   type: string
 */
