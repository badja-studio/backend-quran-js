const express = require('express');
const router = express.Router();
const assessorController = require('../controller/assessor.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET routes
router.get('/', (req, res) => assessorController.getAllAssessors(req, res));
router.get('/profile', (req, res) => assessorController.getMyProfile(req, res));
router.get('/participants', (req, res) => assessorController.getMyParticipants(req, res));
router.get('/statistics', (req, res) => assessorController.getMyStatistics(req, res));
router.get('/:id', (req, res) => assessorController.getAssessorById(req, res));
router.get('/:id/participants', (req, res) => assessorController.getAssessorParticipants(req, res));
router.get('/:id/statistics', (req, res) => assessorController.getAssessorStatistics(req, res));

// POST routes
router.post('/', (req, res) => assessorController.createAssessor(req, res));
router.post('/assign-participant', (req, res) => assessorController.assignParticipantToMe(req, res));
router.post('/:id/assign-participant', (req, res) => assessorController.assignParticipant(req, res));

// PUT routes
router.put('/:id', (req, res) => assessorController.updateAssessor(req, res));
router.put('/:id/update-counts', (req, res) => assessorController.updateParticipantCounts(req, res));
router.put('/:id/unassign-participant', (req, res) => assessorController.unassignParticipant(req, res));

// DELETE routes
router.delete('/:id', (req, res) => assessorController.deleteAssessor(req, res));

module.exports = router;
