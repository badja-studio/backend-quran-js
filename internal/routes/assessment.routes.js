const express = require('express');
const router = express.Router();
const assessmentController = require('../controller/assessment.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET routes
router.get('/', assessmentController.getAllAssessments);
router.get('/my-assessments', assessmentController.getMyAssessments);
router.get('/my-summary', assessmentController.getMyAssessmentSummary);
router.get('/participant/:participantId', assessmentController.getAssessmentsByParticipant);
router.get('/participant/:participantId/summary', assessmentController.getParticipantAssessmentSummary);
router.get('/assessor/:assessorId', assessmentController.getAssessmentsByAssessor);
router.get('/assessor/:assessorId/summary', assessmentController.getAssessorAssessmentSummary);
router.get('/:id', assessmentController.getAssessmentById);

// POST routes
router.post('/', assessmentController.createAssessment);
router.post('/bulk', assessmentController.createBulkAssessments);

// PUT routes
router.put('/:id', assessmentController.updateAssessment);

// DELETE routes
router.delete('/:id', assessmentController.deleteAssessment);
router.delete('/participant/:participantId/assessor/:assessorId', assessmentController.deleteAssessmentsByParticipantAndAssessor);

module.exports = router;
