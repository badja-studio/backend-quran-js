/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardOverview:
 *       type: object
 *       properties:
 *         basicStats:
 *           type: object
 *           properties:
 *             totalParticipants:
 *               type: integer
 *               example: 252750
 *             completedAssessments:
 *               type: integer
 *               example: 107244
 *             totalAssessors:
 *               type: integer
 *               example: 150
 *             avgScore:
 *               type: number
 *               example: 87.87
 *         participationByLevel:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "SD/Sederajat"
 *               total:
 *                 type: integer
 *                 example: 156792
 *               done:
 *                 type: integer
 *                 example: 67854
 *         participationByProvince:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jawa Barat"
 *               registered:
 *                 type: integer
 *                 example: 12000
 *               participated:
 *                 type: integer
 *                 example: 8000
 *         demographics:
 *           type: object
 *           properties:
 *             gender:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Laki-laki"
 *                   value:
 *                     type: integer
 *                     example: 12400
 *             employeeStatus:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "PNS"
 *                   value:
 *                     type: integer
 *                     example: 8200
 *             institutionType:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Negeri"
 *                   value:
 *                     type: integer
 *                     example: 5400
 *         averageScores:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 example: "Rata² SD"
 *               value:
 *                 type: string
 *                 example: "87.52"
 * 
 *     ParticipationStats:
 *       type: object
 *       properties:
 *         byEducationLevel:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               total:
 *                 type: integer
 *               done:
 *                 type: integer
 *         byProvince:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               registered:
 *                 type: integer
 *               participated:
 *                 type: integer
 * 
 *     PerformanceAnalytics:
 *       type: object
 *       properties:
 *         averageScores:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *               value:
 *                 type: string
 *         provinceAchievement:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               terendah:
 *                 type: number
 *               tertinggi:
 *                 type: number
 *               rata:
 *                 type: number
 *         fluencyLevels:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lancar:
 *                 type: integer
 *               mahir:
 *                 type: integer
 *               kurang_lancar:
 *                 type: integer
 * 
 *     ErrorAnalysis:
 *       type: object
 *       properties:
 *         makharij:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               total:
 *                 type: integer
 *         sifat:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               total:
 *                 type: integer
 *         ahkam:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               total:
 *                 type: integer
 *         mad:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               total:
 *                 type: integer
 *         penalties:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               total:
 *                 type: number
 */

/**
 * @swagger
 * /api/dashboard/overview:
 *   get:
 *     summary: Get comprehensive dashboard data
 *     description: Retrieve all dashboard data including statistics, participation, demographics, and performance metrics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard overview retrieved successfully
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
 *                   example: "Dashboard overview retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/DashboardOverview'
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/dashboard/statistics:
 *   get:
 *     summary: Get basic statistics
 *     description: Retrieve basic dashboard statistics including total participants, assessments, and average scores
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Basic statistics retrieved successfully
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
 *                   example: "Basic statistics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalParticipants:
 *                       type: integer
 *                       example: 252750
 *                     completedAssessments:
 *                       type: integer
 *                       example: 107244
 *                     totalAssessors:
 *                       type: integer
 *                       example: 150
 *                     avgScore:
 *                       type: number
 *                       example: 87.87
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/dashboard/participation:
 *   get:
 *     summary: Get participation statistics
 *     description: Retrieve participation statistics by education level and province
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Participation statistics retrieved successfully
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
 *                   example: "Participation statistics retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/ParticipationStats'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/dashboard/demographics:
 *   get:
 *     summary: Get demographic data
 *     description: Retrieve demographic data including gender, employee status, and institution type distribution
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Demographic data retrieved successfully
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
 *                   example: "Demographic data retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     gender:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Laki-laki"
 *                           value:
 *                             type: integer
 *                             example: 12400
 *                     employeeStatus:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "PNS"
 *                           value:
 *                             type: integer
 *                             example: 8200
 *                     institutionType:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Negeri"
 *                           value:
 *                             type: integer
 *                             example: 5400
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/dashboard/performance:
 *   get:
 *     summary: Get performance analytics
 *     description: Retrieve performance analytics including average scores, province achievements, and fluency levels
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance analytics retrieved successfully
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
 *                   example: "Performance analytics retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/PerformanceAnalytics'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/dashboard/errors:
 *   get:
 *     summary: Get error analysis
 *     description: Retrieve error analysis data including makharij, sifat, ahkam, mad errors and penalties
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Error analysis retrieved successfully
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
 *                   example: "Error analysis retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/ErrorAnalysis'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/dashboard/provinces:
 *   get:
 *     summary: Get province data
 *     description: Retrieve province-specific data including participation, achievement, and fluency data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Province data retrieved successfully
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
 *                   example: "Province data retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     participation:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           registered:
 *                             type: integer
 *                           participated:
 *                             type: integer
 *                     achievement:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           terendah:
 *                             type: number
 *                           tertinggi:
 *                             type: number
 *                           rata:
 *                             type: number
 *                     fluency:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           lancar:
 *                             type: integer
 *                           mahir:
 *                             type: integer
 *                           kurang_lancar:
 *                             type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

module.exports = {};
