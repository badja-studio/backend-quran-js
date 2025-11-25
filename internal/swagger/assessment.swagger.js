/**
 * @swagger
 * components:
 *   schemas:
 *     CriteriaGroup:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         criteria:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Criterion'
 *     
 *     Criterion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         criteriaGroupId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         maxScore:
 *           type: integer
 *           default: 100
 *         weight:
 *           type: number
 *           format: decimal
 *           default: 1.0
 *     
 *     Schedule:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         startTime:
 *           type: string
 *           format: time
 *         endTime:
 *           type: string
 *           format: time
 *         assessees:
 *           type: array
 *           items:
 *             type: object
 *     
 *     Assessment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         assesseeId:
 *           type: string
 *           format: uuid
 *         assessorId:
 *           type: string
 *           format: uuid
 *         criterionId:
 *           type: string
 *           format: uuid
 *         score:
 *           type: number
 *           format: decimal
 *         notes:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   - name: Admin - Criteria Groups
 *     description: Manage criteria groups (Admin only)
 *   - name: Admin - Criteria
 *     description: Manage individual criteria (Admin only)
 *   - name: Admin - Schedules
 *     description: Manage assessment schedules (Admin only)
 *   - name: Admin - Assessees
 *     description: Manage assessees (Admin only)
 *   - name: Admin - Assessors
 *     description: Manage assessors (Admin only)
 *   - name: Assessor
 *     description: Assessor endpoints
 *   - name: Assessee
 *     description: Assessee endpoints
 */

/**
 * @swagger
 * /api/v1/admin/criteria-groups:
 *   post:
 *     summary: Create criteria group
 *     tags: [Admin - Criteria Groups]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *   get:
 *     summary: Get all criteria groups
 *     tags: [Admin - Criteria Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/admin/criteria-groups/{id}:
 *   get:
 *     summary: Get criteria group by ID
 *     tags: [Admin - Criteria Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   put:
 *     summary: Update criteria group
 *     tags: [Admin - Criteria Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete criteria group
 *     tags: [Admin - Criteria Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 * 
 * /api/v1/admin/criteria-groups/{groupId}/criteria:
 *   post:
 *     summary: Add criterion to group
 *     tags: [Admin - Criteria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               maxScore:
 *                 type: integer
 *                 default: 100
 *               weight:
 *                 type: number
 *                 default: 1.0
 *     responses:
 *       201:
 *         description: Created
 * 
 * /api/v1/admin/criteria/{id}:
 *   put:
 *     summary: Update criterion
 *     tags: [Admin - Criteria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               maxScore:
 *                 type: integer
 *               weight:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete criterion
 *     tags: [Admin - Criteria]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 * 
 * /api/v1/admin/schedules:
 *   post:
 *     summary: Create schedule
 *     tags: [Admin - Schedules]
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
 *               - date
 *               - startTime
 *               - endTime
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *                 format: time
 *               endTime:
 *                 type: string
 *                 format: time
 *     responses:
 *       201:
 *         description: Created
 *   get:
 *     summary: Get all schedules
 *     tags: [Admin - Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/admin/schedules/{id}:
 *   get:
 *     summary: Get schedule by ID
 *     tags: [Admin - Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   put:
 *     summary: Update schedule
 *     tags: [Admin - Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete schedule
 *     tags: [Admin - Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 * 
 * /api/v1/admin/schedules/{id}/add-assessees:
 *   post:
 *     summary: Add assessees to schedule
 *     tags: [Admin - Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assesseeIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/admin/schedules/{scheduleId}/assessees/{assesseeId}:
 *   delete:
 *     summary: Remove assessee from schedule
 *     tags: [Admin - Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: assesseeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed
 * 
 * /api/v1/admin/assessees:
 *   get:
 *     summary: Get all assessees
 *     tags: [Admin - Assessees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/admin/assessees/{id}:
 *   get:
 *     summary: Get assessee by ID
 *     tags: [Admin - Assessees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/admin/assessees/{id}/assign-assessor:
 *   post:
 *     summary: Assign assessor to assessee
 *     tags: [Admin - Assessees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessorId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Assigned
 * 
 * /api/v1/admin/assessees/{assesseeId}/assessors/{assessorId}:
 *   delete:
 *     summary: Remove assessor from assessee
 *     tags: [Admin - Assessees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assesseeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: assessorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed
 * 
 * /api/v1/admin/assessees/{id}/assign-group:
 *   post:
 *     summary: Assign criteria group to assessee
 *     tags: [Admin - Assessees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               criteriaGroupId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Assigned
 * 
 * /api/v1/admin/assessors:
 *   get:
 *     summary: Get all assessors
 *     tags: [Admin - Assessors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/admin/assessors/{id}/assessees:
 *   get:
 *     summary: Get assessor's assessees
 *     tags: [Admin - Assessors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/assessor/assessees:
 *   get:
 *     summary: Get my assigned assessees
 *     tags: [Assessor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/assessor/assessees/{id}:
 *   get:
 *     summary: Get assessee detail with criteria
 *     tags: [Assessor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/assessor/assessees/{assesseeId}/assess:
 *   post:
 *     summary: Submit assessments for assessee
 *     tags: [Assessor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assesseeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     criterionId:
 *                       type: string
 *                     score:
 *                       type: number
 *                     notes:
 *                       type: string
 *     responses:
 *       200:
 *         description: Submitted
 * 
 * /api/v1/assessor/assessments:
 *   get:
 *     summary: Get my given assessments
 *     tags: [Assessor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/assessor/assessments/{id}:
 *   put:
 *     summary: Update my assessment
 *     tags: [Assessor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 * 
 * /api/v1/assessee/profile:
 *   get:
 *     summary: Get my profile
 *     tags: [Assessee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/assessee/assessments:
 *   get:
 *     summary: Get my assessments
 *     tags: [Assessee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/assessee/summary:
 *   get:
 *     summary: Get assessment summary with weighted averages
 *     tags: [Assessee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/v1/assessee/schedule:
 *   get:
 *     summary: Get my schedule
 *     tags: [Assessee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */

module.exports = {};
