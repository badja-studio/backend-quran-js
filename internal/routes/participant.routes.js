const express = require('express');
const router = express.Router();
const participantController = require('../controller/participant.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { cacheMiddleware, noCache } = require('../middleware/cache.middleware');
const config = require('../../config/config');

// Cache middleware for participant data (1 minute TTL)
const participantCache = cacheMiddleware({ ttl: config.cache.defaultTTL });
const participantCacheUserSpecific = cacheMiddleware({ ttl: config.cache.defaultTTL, userSpecific: true });

// Routes without authentication
router.post('/register', (req, res) => participantController.registerParticipant(req, res));

// Apply authentication middleware to all other routes
router.use(authenticateToken);

// GET routes (with cache)
router.get('/', participantCache, (req, res) => participantController.getAllParticipants(req, res));
router.get('/profile', participantCacheUserSpecific, (req, res) => participantController.getMyProfile(req, res));

// GET routes (NO CACHE - explicit exclusions)
router.get('/not-assessed', noCache(), (req, res) => participantController.getNotAssessedParticipants(req, res));
router.get('/ready-to-assess', noCache(), (req, res) => participantController.getReadyToAssessParticipants(req, res));

// GET routes (with cache)
router.get('/statistics', participantCache, (req, res) => participantController.getStatistics(req, res));
router.get('/my-assessments', participantCacheUserSpecific, (req, res) => participantController.getMyAssessments(req, res));
router.get('/:id', participantCache, (req, res) => participantController.getParticipantById(req, res));
router.get('/:id/assessments', participantCache, (req, res) => participantController.getParticipantAssessments(req, res));

// POST routes
router.post('/', (req, res) => participantController.createParticipant(req, res));

// PUT routes
router.put('/:id', (req, res) => participantController.updateParticipant(req, res));
router.put('/:id/assign-assessor', (req, res) => participantController.assignAssessor(req, res));
router.put('/:id/assessor-schedule', (req, res) => participantController.updateAssessorAndSchedule(req, res));
router.put('/:id/status', (req, res) => participantController.updateStatus(req, res));

// DELETE routes
router.delete('/:id', (req, res) => participantController.deleteParticipant(req, res));

module.exports = router;
