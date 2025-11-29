const express = require('express');
const router = express.Router();
const participantController = require('../controller/participant.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET routes
router.get('/', participantController.getAllParticipants);
router.get('/profile', participantController.getMyProfile);
router.get('/not-assessed', participantController.getNotAssessedParticipants);
router.get('/ready-to-assess', participantController.getReadyToAssessParticipants);
router.get('/statistics', participantController.getStatistics);
router.get('/my-assessments', participantController.getMyAssessments);
router.get('/:id', participantController.getParticipantById);
router.get('/:id/assessments', participantController.getParticipantAssessments);

// POST routes
router.post('/', participantController.createParticipant);

// PUT routes
router.put('/:id', participantController.updateParticipant);
router.put('/:id/assign-assessor', participantController.assignAssessor);
router.put('/:id/status', participantController.updateStatus);

// DELETE routes
router.delete('/:id', participantController.deleteParticipant);

module.exports = router;
