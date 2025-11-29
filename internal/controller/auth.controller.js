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
     * Register a new user
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
     * User login
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
     * Refresh access token
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

    async getProfile(req, res) {
        try {
            const user = req.user; // Set by auth middleware
            
            return res.status(200).json({
                success: true,
                message: 'Profile retrieved successfully',
                data: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
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
