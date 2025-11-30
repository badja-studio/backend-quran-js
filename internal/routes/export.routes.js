const express = require('express');
const router = express.Router();
const exportController = require('../controller/export.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * Export Routes
 * All routes require authentication
 */

// Participants export routes
router.get('/participants/excel', 
    authMiddleware.authenticateToken, 
    exportController.exportParticipantsExcel
);

router.get('/participants/pdf', 
    authMiddleware.authenticateToken, 
    exportController.exportParticipantsPDF
);

// Participants not assessed export routes
router.get('/participants/not-assessed/excel', 
    authMiddleware.authenticateToken, 
    exportController.exportParticipantsNotAssessedExcel
);

router.get('/participants/not-assessed/pdf', 
    authMiddleware.authenticateToken, 
    exportController.exportParticipantsNotAssessedPDF
);

// Participants ready to assess export routes
router.get('/participants/ready-to-assess/excel', 
    authMiddleware.authenticateToken, 
    exportController.exportParticipantsReadyToAssessExcel
);

router.get('/participants/ready-to-assess/pdf', 
    authMiddleware.authenticateToken, 
    exportController.exportParticipantsReadyToAssessPDF
);

// Assessors export routes
router.get('/assessors/excel', 
    authMiddleware.authenticateToken, 
    exportController.exportAssessorsExcel
);

router.get('/assessors/pdf', 
    authMiddleware.authenticateToken, 
    exportController.exportAssessorsPDF
);

// Assessments export routes
router.get('/assessments/excel', 
    authMiddleware.authenticateToken, 
    exportController.exportAssessmentsExcel
);

router.get('/assessments/pdf', 
    authMiddleware.authenticateToken, 
    exportController.exportAssessmentsPDF
);

module.exports = router;
