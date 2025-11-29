/**
 * @swagger
 * components:
 *   schemas:
 *     Assessor:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - email
 *         - akun_id
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the assessor
 *         name:
 *           type: string
 *           description: Full name of the assessor
 *         username:
 *           type: string
 *           description: Username for the assessor
 *         no_telepon:
 *           type: string
 *           description: Phone number
 *         email:
 *           type: string
 *           format: email
 *           description: Email address
 *         link_grup_wa:
 *           type: string
 *           description: WhatsApp group link
 *         total_peserta_belum_asesmen:
 *           type: integer
 *           description: Total participants not yet assessed
 *         total_peserta_selesai_asesmen:
 *           type: integer
 *           description: Total participants already assessed
 *         akun_id:
 *           type: integer
 *           description: User account ID
 *         user:
 *           $ref: '#/components/schemas/UserBasic'
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ParticipantBasic'
 *     
 *     AssessorCreate:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - email
 *         - akun_id
 *       properties:
 *         name:
 *           type: string
 *         username:
 *           type: string
 *         no_telepon:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         link_grup_wa:
 *           type: string
 *         akun_id:
 *           type: integer
 *     
 *     AssessorBasic:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *     
 *     PaginatedAssessors:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Assessor'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 */

/**
 * @swagger
 * /assessors:
 *   get:
 *     summary: Get all assessors with pagination, filtering, and search
 *     tags: [Assessors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name, username, email, etc.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: created_at
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Assessors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedAssessors'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new assessor
 *     tags: [Assessors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssessorCreate'
 *     responses:
 *       201:
 *         description: Assessor created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /assessors/profile:
 *   get:
 *     summary: Get current user's assessor profile
 *     tags: [Assessors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
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
 *                   $ref: '#/components/schemas/Assessor'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Assessor not found
 */

/**
 * @swagger
 * /assessors/participants:
 *   get:
 *     summary: Get current assessor's participants
 *     tags: [Assessors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SUDAH, BELUM]
 *         description: Filter by assessment status
 *     responses:
 *       200:
 *         description: My participants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedParticipants'
 */

/**
 * @swagger
 * /assessors/statistics:
 *   get:
 *     summary: Get current assessor's statistics
 *     tags: [Assessors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
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
 *                     assessor:
 *                       $ref: '#/components/schemas/Assessor'
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         total_participants:
 *                           type: integer
 *                         belum_dinilai:
 *                           type: integer
 *                         sudah_dinilai:
 *                           type: integer
 */

/**
 * @swagger
 * /assessors/assign-participant:
 *   post:
 *     summary: Assign participant to current assessor
 *     tags: [Assessors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participant_id
 *             properties:
 *               participant_id:
 *                 type: integer
 *                 description: Participant ID to assign
 *     responses:
 *       200:
 *         description: Participant assigned successfully
 *       400:
 *         description: Bad request or participant already assigned
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Participant not found
 */

/**
 * @swagger
 * /assessors/{id}:
 *   get:
 *     summary: Get assessor by ID
 *     tags: [Assessors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Assessor ID
 *     responses:
 *       200:
 *         description: Assessor retrieved successfully
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
 *                   $ref: '#/components/schemas/Assessor'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Assessor not found
 *   put:
 *     summary: Update assessor
 *     tags: [Assessors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssessorCreate'
 *     responses:
 *       200:
 *         description: Assessor updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Assessor not found
 *   delete:
 *     summary: Delete assessor
 *     tags: [Assessors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Assessor deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Assessor not found
 *       409:
 *         description: Cannot delete assessor with assigned participants
 */

/**
 * @swagger
 * /assessors/{id}/participants:
 *   get:
 *     summary: Get participants assigned to specific assessor
 *     tags: [Assessors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SUDAH, BELUM]
 *     responses:
 *       200:
 *         description: Assessor participants retrieved successfully
 */

/**
 * @swagger
 * /assessors/{id}/assign-participant:
 *   post:
 *     summary: Assign participant to specific assessor
 *     tags: [Assessors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participant_id
 *             properties:
 *               participant_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Participant assigned successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /assessors/{id}/unassign-participant:
 *   put:
 *     summary: Unassign participant from assessor
 *     tags: [Assessors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participant_id
 *             properties:
 *               participant_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Participant unassigned successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
