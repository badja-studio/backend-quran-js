const express = require('express');
const router = express.Router();
const assessorController = require('../controller/assessor.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET routes
router.get('/', assessorController.getAllAssessors);
router.get('/profile', assessorController.getMyProfile);
router.get('/participants', assessorController.getMyParticipants);
router.get('/statistics', assessorController.getMyStatistics);
router.get('/:id', assessorController.getAssessorById);
router.get('/:id/participants', assessorController.getAssessorParticipants);
router.get('/:id/statistics', assessorController.getAssessorStatistics);

// POST routes
router.post('/', assessorController.createAssessor);
router.post('/assign-participant', assessorController.assignParticipantToMe);
router.post('/:id/assign-participant', assessorController.assignParticipant);

// PUT routes
router.put('/:id', assessorController.updateAssessor);
router.put('/:id/update-counts', assessorController.updateParticipantCounts);
router.put('/:id/unassign-participant', assessorController.unassignParticipant);

// DELETE routes
router.delete('/:id', assessorController.deleteAssessor);

module.exports = router;
