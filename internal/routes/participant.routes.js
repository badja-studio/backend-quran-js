const express = require('express');
const router = express.Router();
const participantController = require('../controller/participant.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET routes
router.get('/', (req, res) => participantController.getAllParticipants(req, res));
router.get('/profile', (req, res) => participantController.getMyProfile(req, res));
router.get('/not-assessed', (req, res) => participantController.getNotAssessedParticipants(req, res));
router.get('/ready-to-assess', (req, res) => participantController.getReadyToAssessParticipants(req, res));
router.get('/statistics', (req, res) => participantController.getStatistics(req, res));
router.get('/my-assessments', (req, res) => participantController.getMyAssessments(req, res));
router.get('/:id', (req, res) => participantController.getParticipantById(req, res));
router.get('/:id/assessments', (req, res) => participantController.getParticipantAssessments(req, res));

// POST routes
router.post('/', (req, res) => participantController.createParticipant(req, res));

// PUT routes
router.put('/:id', (req, res) => participantController.updateParticipant(req, res));
router.put('/:id/assign-assessor', (req, res) => participantController.assignAssessor(req, res));
router.put('/:id/status', (req, res) => participantController.updateStatus(req, res));

// DELETE routes
router.delete('/:id', (req, res) => participantController.deleteParticipant(req, res));

module.exports = router;
