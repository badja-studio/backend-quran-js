const AdminUseCase = require('../usecase/admin.usecase');

class AdminController {
  constructor() {
    this.adminUseCase = new AdminUseCase();
  }

  /**
   * @swagger
   * /api/admins:
   *   post:
   *     summary: Create a new admin
   *     description: Creates a new admin user. The username will be used as the initial password.
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - username
   *               - email
   *             properties:
   *               name:
   *                 type: string
   *                 description: Admin's full name
   *                 example: "John Doe"
   *               username:
   *                 type: string
   *                 description: Admin's username (will be used as initial password)
   *                 example: "johndoe"
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Admin's email address
   *                 example: "john.doe@example.com"
   *               phone:
   *                 type: string
   *                 description: Admin's phone number
   *                 example: "+628123456789"
   *     responses:
   *       201:
   *         description: Admin created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "success"
   *                 message:
   *                   type: string
   *                   example: "Admin created successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     admin:
   *                       $ref: '#/components/schemas/Admin'
   *                     credentials:
   *                       type: object
   *                       properties:
   *                         username:
   *                           type: string
   *                         password:
   *                           type: string
   *                         message:
   *                           type: string
   *       400:
   *         description: Invalid input data
   *       409:
   *         description: Username or email already exists
   *       500:
   *         description: Server error
   */
  async createAdmin(req, res) {
    try {
      const { name, username, email, phone } = req.body;

      // Validate required fields
      if (!name || !username || !email) {
        return res.status(400).json({
          status: 'error',
          message: 'Name, username, and email are required',
        });
      }

      const result = await this.adminUseCase.createAdmin({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim(),
      });

      return res.status(201).json({
        status: 'success',
        message: 'Admin created successfully',
        data: result,
      });
    } catch (error) {
      console.error('Create admin error:', error);

      if (error.message.includes('already exists')) {
        return res.status(409).json({
          status: 'error',
          message: error.message,
        });
      }

      return res.status(500).json({
        status: 'error',
        message: 'Failed to create admin',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * @swagger
   * /api/admins:
   *   get:
   *     summary: Get all admins
   *     description: Retrieve a paginated list of all admins with filtering and search capabilities
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number for pagination
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
   *         description: Search term for name, username, email, or phone
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [name, username, email, created_at]
   *           default: created_at
   *         description: Field to sort by
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [ASC, DESC]
   *           default: DESC
   *         description: Sort order
   *       - in: query
   *         name: filters
   *         schema:
   *           type: string
   *         description: JSON string of filters array
   *     responses:
   *       200:
   *         description: Admins retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "success"
   *                 message:
   *                   type: string
   *                   example: "Admins retrieved successfully"
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Admin'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   *       500:
   *         description: Server error
   */
  async getAllAdmins(req, res) {
    try {
      const result = await this.adminUseCase.getAllAdmins(req.query);

      return res.status(200).json({
        status: 'success',
        message: 'Admins retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error('Get all admins error:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve admins',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * @swagger
   * /api/admins/{id}:
   *   get:
   *     summary: Get admin by ID
   *     description: Retrieve a specific admin by their ID
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Admin ID
   *     responses:
   *       200:
   *         description: Admin retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "success"
   *                 message:
   *                   type: string
   *                   example: "Admin retrieved successfully"
   *                 data:
   *                   $ref: '#/components/schemas/Admin'
   *       404:
   *         description: Admin not found
   *       500:
   *         description: Server error
   */
  async getAdminById(req, res) {
    try {
      const { id } = req.params;

      const admin = await this.adminUseCase.getAdminById(id);

      return res.status(200).json({
        status: 'success',
        message: 'Admin retrieved successfully',
        data: admin,
      });
    } catch (error) {
      console.error('Get admin by ID error:', error);

      if (error.message === 'Admin not found') {
        return res.status(404).json({
          status: 'error',
          message: 'Admin not found',
        });
      }

      return res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve admin',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * @swagger
   * /api/admins/{id}/reset-password:
   *   post:
   *     summary: Reset admin password
   *     description: Reset admin password to their username
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Admin ID
   *     responses:
   *       200:
   *         description: Password reset successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "success"
   *                 message:
   *                   type: string
   *                   example: "Password reset successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     username:
   *                       type: string
   *                     newPassword:
   *                       type: string
   *                     message:
   *                       type: string
   *       404:
   *         description: Admin not found
   *       500:
   *         description: Server error
   */
  async resetPassword(req, res) {
    try {
      const { id } = req.params;

      const result = await this.adminUseCase.resetAdminPassword(id);

      return res.status(200).json({
        status: 'success',
        message: 'Password reset successfully',
        data: result,
      });
    } catch (error) {
      console.error('Reset password error:', error);

      if (error.message === 'Admin not found') {
        return res.status(404).json({
          status: 'error',
          message: 'Admin not found',
        });
      }

      return res.status(500).json({
        status: 'error',
        message: 'Failed to reset password',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  /**
   * @swagger
   * /api/admins/profile:
   *   get:
   *     summary: Get admin profile by token
   *     description: Get current admin's profile information using the JWT token
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Admin profile retrieved successfully
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
   *                   example: "Admin profile retrieved successfully"
   *                 data:
   *                   $ref: '#/components/schemas/Admin'
   *       404:
   *         description: Admin not found
   *       401:
   *         description: Unauthorized access
   *       500:
   *         description: Server error
   */
  async getAdminProfile(req, res) {
    try {
      const userId = req.user.id; // From auth middleware
      
      const admin = await this.adminUseCase.getAdminByUserId(userId);
      
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin profile not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Admin profile retrieved successfully',
        data: admin
      });
    } catch (error) {
      console.error('Error in getAdminProfile:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve admin profile'
      });
    }
  }
}

module.exports = AdminController;
