const express = require('express');
const router = express.Router();
const assessmentController = require('../controller/assessment.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { cacheMiddleware } = require('../middleware/cache.middleware');
const config = require('../../config/config');

// Cache middleware for assessment data (1 minute TTL)
const assessmentCache = cacheMiddleware({ ttl: config.cache.defaultTTL });
const assessmentCacheUserSpecific = cacheMiddleware({ ttl: config.cache.defaultTTL, userSpecific: true });

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET routes (regular cache)
router.get('/', assessmentCache, (req, res) => assessmentController.getAllAssessments(req, res));

// GET routes (user-specific cache)
router.get('/my-assessments', assessmentCacheUserSpecific, (req, res) => assessmentController.getMyAssessments(req, res));
router.get('/my-summary', assessmentCacheUserSpecific, (req, res) => assessmentController.getMyAssessmentSummary(req, res));

// GET routes (regular cache)
router.get('/participant/:participantId', assessmentCache, (req, res) => assessmentController.getAssessmentsByParticipant(req, res));
router.get('/participant/:participantId/summary', assessmentCache, (req, res) => assessmentController.getParticipantAssessmentSummary(req, res));
router.get('/assessor/:assessorId', assessmentCache, (req, res) => assessmentController.getAssessmentsByAssessor(req, res));
router.get('/assessor/:assessorId/summary', assessmentCache, (req, res) => assessmentController.getAssessorAssessmentSummary(req, res));
router.get('/:id', assessmentCache, (req, res) => assessmentController.getAssessmentById(req, res));

// POST routes
router.post('/', (req, res) => assessmentController.createAssessment(req, res));
router.post('/bulk', (req, res) => assessmentController.createBulkAssessments(req, res));

// PUT routes
router.put('/:id', (req, res) => assessmentController.updateAssessment(req, res));

// DELETE routes
router.delete('/:id', (req, res) => assessmentController.deleteAssessment(req, res));
router.delete('/participant/:participantId/assessor/:assessorId', (req, res) => assessmentController.deleteAssessmentsByParticipantAndAssessor(req, res));

module.exports = router;
