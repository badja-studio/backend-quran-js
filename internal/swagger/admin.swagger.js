/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - username
 *         - email
 *         - user_id
 *       properties:
 *         id:
 *           type: integer
 *           description: Admin unique identifier
 *           example: 1
 *         name:
 *           type: string
 *           description: Admin's full name
 *           example: "John Doe"
 *         username:
 *           type: string
 *           description: Admin's username
 *           example: "johndoe"
 *         email:
 *           type: string
 *           format: email
 *           description: Admin's email address
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           description: Admin's phone number
 *           nullable: true
 *           example: "+628123456789"
 *         user_id:
 *           type: integer
 *           description: Associated user ID
 *           example: 1
 *         user:
 *           type: object
 *           description: Associated user information
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             role:
 *               type: string
 *               example: "admin"
 *             is_active:
 *               type: boolean
 *               example: true
 *             last_login:
 *               type: string
 *               format: date-time
 *               nullable: true
 *               example: "2024-01-15T10:30:00.000Z"
 *             created_at:
 *               type: string
 *               format: date-time
 *               example: "2024-01-15T09:00:00.000Z"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Admin creation timestamp
 *           example: "2024-01-15T09:00:00.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Admin last update timestamp
 *           example: "2024-01-15T09:00:00.000Z"
 * 
 *     CreateAdminRequest:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: Admin's full name
 *           example: "John Doe"
 *         username:
 *           type: string
 *           description: Admin's username (will be used as initial password)
 *           example: "johndoe"
 *         email:
 *           type: string
 *           format: email
 *           description: Admin's email address
 *           example: "john.doe@example.com"
 *         phone:
 *           type: string
 *           description: Admin's phone number
 *           example: "+628123456789"
 * 
 *     AdminResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Admin created successfully"
 *         data:
 *           $ref: '#/components/schemas/Admin'
 * 
 *     AdminListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Admins retrieved successfully"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Admin'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 * 
 *     CreateAdminResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Admin created successfully"
 *         data:
 *           type: object
 *           properties:
 *             admin:
 *               $ref: '#/components/schemas/Admin'
 *             credentials:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: "johndoe"
 *                 password:
 *                   type: string
 *                   example: "johndoe"
 *                 message:
 *                   type: string
 *                   example: "Admin created successfully. Username serves as initial password."
 * 
 *     ResetPasswordResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Password reset successfully"
 *         data:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               example: "johndoe"
 *             newPassword:
 *               type: string
 *               example: "johndoe"
 *             message:
 *               type: string
 *               example: "Password reset successfully"
 * 
 * tags:
 *   - name: Admin
 *     description: Admin management endpoints
 */

// This file is used to define Swagger schemas for Admin endpoints
module.exports = {};
