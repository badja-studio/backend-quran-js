const express = require('express');
const router = express.Router();
const assessmentController = require('../controller/assessment.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET routes
router.get('/', (req, res) => assessmentController.getAllAssessments(req, res));
router.get('/my-assessments', (req, res) => assessmentController.getMyAssessments(req, res));
router.get('/my-summary', (req, res) => assessmentController.getMyAssessmentSummary(req, res));
router.get('/participant/:participantId', (req, res) => assessmentController.getAssessmentsByParticipant(req, res));
router.get('/participant/:participantId/summary', (req, res) => assessmentController.getParticipantAssessmentSummary(req, res));
router.get('/assessor/:assessorId', (req, res) => assessmentController.getAssessmentsByAssessor(req, res));
router.get('/assessor/:assessorId/summary', (req, res) => assessmentController.getAssessorAssessmentSummary(req, res));
router.get('/:id', (req, res) => assessmentController.getAssessmentById(req, res));

// POST routes
router.post('/', (req, res) => assessmentController.createAssessment(req, res));
router.post('/bulk', (req, res) => assessmentController.createBulkAssessments(req, res));

// PUT routes
router.put('/:id', (req, res) => assessmentController.updateAssessment(req, res));

// DELETE routes
router.delete('/:id', (req, res) => assessmentController.deleteAssessment(req, res));
router.delete('/participant/:participantId/assessor/:assessorId', (req, res) => assessmentController.deleteAssessmentsByParticipantAndAssessor(req, res));

module.exports = router;
