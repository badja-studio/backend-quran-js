const express = require('express');
const router = express.Router();
const assessorController = require('../controller/assessor.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { cacheMiddleware } = require('../middleware/cache.middleware');
const config = require('../../config/config');

// Cache middleware for assessor data (1 minute TTL)
const assessorCache = cacheMiddleware({ ttl: config.cache.defaultTTL });
const assessorCacheUserSpecific = cacheMiddleware({ ttl: config.cache.defaultTTL, userSpecific: true });

// Public routes (no authentication required)
router.get('/', assessorCache, (req, res) => assessorController.getAllAssessors(req, res));

// Apply authentication middleware to protected routes
router.use(authenticateToken);

// Protected GET routes (user-specific cache)
router.get('/profile', assessorCacheUserSpecific, (req, res) => assessorController.getMyProfile(req, res));
router.get('/participants', assessorCacheUserSpecific, (req, res) => assessorController.getMyParticipants(req, res));
router.get('/statistics', assessorCacheUserSpecific, (req, res) => assessorController.getMyStatistics(req, res));

// Protected GET routes (regular cache)
router.get('/:id', assessorCache, (req, res) => assessorController.getAssessorById(req, res));
router.get('/:id/participants', assessorCache, (req, res) => assessorController.getAssessorParticipants(req, res));
router.get('/:id/statistics', assessorCache, (req, res) => assessorController.getAssessorStatistics(req, res));

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
