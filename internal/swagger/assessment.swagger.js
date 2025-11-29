/**
 * @swagger
 * components:
 *   schemas:
 *     Assessment:
 *       type: object
 *       required:
 *         - peserta_id
 *         - asesor_id
 *         - huruf
 *         - nilai
 *         - kategori
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the assessment
 *         peserta_id:
 *           type: integer
 *           description: Participant ID
 *         asesor_id:
 *           type: integer
 *           description: Assessor ID
 *         huruf:
 *           type: string
 *           enum: [A, B, C, D, E]
 *           description: Letter grade
 *         nilai:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           description: Numeric score
 *         kategori:
 *           type: string
 *           description: Assessment category
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         participant:
 *           $ref: '#/components/schemas/ParticipantBasic'
 *         assessor:
 *           $ref: '#/components/schemas/AssessorBasic'
 * 
 *     AssessmentCreate:
 *       type: object
 *       required:
 *         - peserta_id
 *         - asesor_id
 *         - huruf
 *         - nilai
 *         - kategori
 *       properties:
 *         peserta_id:
 *           type: integer
 *           example: 1
 *         asesor_id:
 *           type: integer
 *           example: 1
 *         huruf:
 *           type: string
 *           enum: [A, B, C, D, E]
 *           example: "A"
 *         nilai:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           example: 95
 *         kategori:
 *           type: string
 *           example: "Tajwid"
 * 
 *     BulkAssessmentCreate:
 *       type: object
 *       required:
 *         - assessments
 *       properties:
 *         assessments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AssessmentCreate'
 */

/**
 * @swagger
 * /api/assessments:
 *   get:
 *     summary: Get all assessments with pagination and filters
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search in participant names and NIPs
 *       - name: sortBy
 *         in: query
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, hasil_assessment, catatan, tanggal_assessment]
 *           default: createdAt
 *         description: Field to sort by
 *       - name: sortOrder
 *         in: query
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order (ASC or DESC)
 *       - name: peserta_id
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         style: form
 *         explode: true
 *         description: Filter by participant IDs (supports multiple values)
 *       - name: asesor_id
 *         in: query
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         style: form
 *         explode: true
 *         description: Filter by assessor IDs (supports multiple values)
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create new assessment
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssessmentCreate'
 *     responses:
 *       201:
 *         description: Created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/assessments/bulk:
 *   post:
 *     summary: Create multiple assessments in bulk
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkAssessmentCreate'
 *     responses:
 *       201:
 *         description: Bulk assessments created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/assessments/my-assessments:
 *   get:
 *     summary: Get my assessments (for assessor)
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: My assessments retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/assessments/my-summary:
 *   get:
 *     summary: Get my assessment summary
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/assessments/participant/{participantId}:
 *   get:
 *     summary: Get assessments by participant
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: participantId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/assessments/participant/{participantId}/summary:
 *   get:
 *     summary: Get participant assessment summary
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: participantId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/assessments/assessor/{assessorId}:
 *   get:
 *     summary: Get assessments by assessor
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: assessorId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/assessments/assessor/{assessorId}/summary:
 *   get:
 *     summary: Get assessor assessment summary
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: assessorId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/assessments/{id}:
 *   get:
 *     summary: Get assessment by ID
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *   put:
 *     summary: Update assessment
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssessmentCreate'
 *     responses:
 *       200:
 *         description: Updated successfully
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete assessment
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/assessments/participant/{participantId}/assessor/{assessorId}:
 *   delete:
 *     summary: Delete assessments by participant and assessor
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: participantId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: assessorId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       401:
 *         description: Unauthorized
 */
