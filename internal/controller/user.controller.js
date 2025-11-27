const userUseCase = require('../usecase/user.usecase');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         siagaNumber:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         username:
 *           type: string
 *         name:
 *           type: string
 *         fullname:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         schoolLevels:
 *           type: string
 *         schoolName:
 *           type: string
 *         levels:
 *           type: string
 *         district:
 *           type: string
 *         waLink:
 *           type: string
 *         roles:
 *           type: string
 *           enum: [Admin, Assessor, Assessee]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaginatedUsersResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             pagination:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of users
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 limit:
 *                   type: integer
 *                   description: Number of items per page
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 hasNext:
 *                   type: boolean
 *                   description: Whether there is a next page
 *                 hasPrevious:
 *                   type: boolean
 *                   description: Whether there is a previous page
 */

class UserController {
    /**
     * @swagger
     * /api/v1/users:
     *   get:
     *     summary: Get all users with pagination
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *           default: 1
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 100
     *           default: 10
     *         description: Number of items per page
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: Search query (searches across email, username, name, fullname, siagaNumber)
     *     responses:
     *       200:
     *         description: Users retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PaginatedUsersResponse'
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    async getAllUsers(req, res) {
        try {
            const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
            const result = await userUseCase.getAllUsers(page, limit, search, sortBy, sortOrder);

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
     * /api/v1/users/{id}:
     *   get:
     *     summary: Get user by ID
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: User ID
     *     responses:
     *       200:
     *         description: User retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 data:
     *                   type: object
     *                   properties:
     *                     user:
     *                       $ref: '#/components/schemas/User'
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const result = await userUseCase.getUserById(id);

            const statusCode = result.success ? 200 : 404;
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
     * /api/v1/users/{id}:
     *   put:
     *     summary: Update user
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: User ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               fullname:
     *                 type: string
     *               phoneNumber:
     *                 type: string
     *               schoolLevels:
     *                 type: string
     *               schoolName:
     *                 type: string
     *               levels:
     *                 type: string
     *               district:
     *                 type: string
     *               waLink:
     *                 type: string
     *               roles:
     *                 type: string
     *                 enum: [Admin, Assessor, Assessee]
     *     responses:
     *       200:
     *         description: User updated successfully
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const result = await userUseCase.updateUser(id, req.body);

            const statusCode = result.success ? 200 : 404;
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
     * /api/v1/users/{id}:
     *   delete:
     *     summary: Delete user
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: User ID
     *     responses:
     *       200:
     *         description: User deleted successfully
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const result = await userUseCase.deleteUser(id);

            const statusCode = result.success ? 200 : 404;
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

module.exports = new UserController();
