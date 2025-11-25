const authUseCase = require('../usecase/auth.usecase');

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - username
 *         - name
 *         - fullname
 *         - siagaNumber
 *       properties:
 *         siagaNumber:
 *           type: string
 *           example: "12345678"
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: SecurePassword123!
 *         username:
 *           type: string
 *           example: johndoe
 *         name:
 *           type: string
 *           example: John
 *         fullname:
 *           type: string
 *           example: John Doe
 *         phoneNumber:
 *           type: string
 *           example: "+62812345678"
 *         schoolLevels:
 *           type: string
 *           example: "SMA"
 *         levels:
 *           type: string
 *           example: "Beginner"
 *         roles:
 *           type: string
 *           enum: [Admin, Assessor, Assessee]
 *           example: Assessee
 *     LoginRequest:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         emailOrUsername:
 *           type: string
 *           example: john.doe@example.com
 *           description: Email or username (required if siagaNumber is not provided)
 *         siagaNumber:
 *           type: string
 *           example: "12345678"
 *           description: Siaga number (required if emailOrUsername is not provided)
 *         password:
 *           type: string
 *           format: password
 *           example: SecurePassword123!
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             name:
 *               type: string
 *             roles:
 *               type: string
 *             authToken:
 *               type: string
 *             refreshToken:
 *               type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

class AuthController {
    /**
     * @swagger
     * /api/v1/auth/register:
     *   post:
     *     summary: Register a new user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RegisterRequest'
     *     responses:
     *       200:
     *         description: User registered successfully
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
     *                   example: User registered successfully
     *                 data:
     *                   type: object
     *                   properties:
     *                     user:
     *                       type: object
     *                       properties:
     *                         id:
     *                           type: string
     *                         email:
     *                           type: string
     *                         username:
     *                           type: string
     *                         name:
     *                           type: string
     *                         fullname:
     *                           type: string
     *                         roles:
     *                           type: string
     *                     token:
     *                       type: string
     *                       description: Access token (same as authToken)
     *                     authToken:
     *                       type: string
     *                       description: Access token valid for 1 day
     *                     refreshToken:
     *                       type: string
     *                       description: Refresh token valid for 30 minutes
     *       400:
     *         description: Validation error or user already exists
     */
    async register(req, res) {
        try {
            const result = await authUseCase.register(req.body);

            const statusCode = result.success ? 200 : 400;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * @swagger
     * /api/v1/auth/login:
     *   post:
     *     summary: Login user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginRequest'
     *     responses:
     *       200:
     *         description: Login successful
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
     *                   example: Login successful
     *                 data:
     *                   type: object
     *                   properties:
     *                     token:
     *                       type: string
     *                       description: Access token (same as authToken)
     *                     name:
     *                       type: string
     *                       example: John
     *                     roles:
     *                       type: string
     *                       example: Student
     *                     authToken:
     *                       type: string
     *                       description: Access token valid for 1 day
     *                     refreshToken:
     *                       type: string
     *                       description: Refresh token valid for 30 minutes
     *       400:
     *         description: Invalid credentials
     */
    async login(req, res) {
        try {
            const result = await authUseCase.login(req.body);

            const statusCode = result.success ? 200 : 400;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }

    /**
     * @swagger
     * /api/v1/auth/refresh:
     *   post:
     *     summary: Refresh access token
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RefreshTokenRequest'
     *     responses:
     *       200:
     *         description: Token refreshed successfully
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
     *                   example: Token refreshed successfully
     *                 data:
     *                   type: object
     *                   properties:
     *                     authToken:
     *                       type: string
     *                       description: New access token
     *                     token:
     *                       type: string
     *                       description: New access token (same as authToken)
     *       400:
     *         description: Invalid or expired refresh token
     */
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            const result = await authUseCase.refreshToken(refreshToken);

            const statusCode = result.success ? 200 : 400;
            return res.status(statusCode).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}

module.exports = new AuthController();
