const express = require('express');
const router = express.Router();
const assessorController = require('../controller/assessor.controller');

// Assessee Routes
router.get('/assessees', assessorController.getMyAssessees);
router.get('/assessees/:id', assessorController.getAssesseeDetail);

// Assessment Routes
router.post('/assessees/:assesseeId/assess', assessorController.submitAssessments);
router.put('/assessments/:id', assessorController.updateAssessment);
router.get('/assessments', assessorController.getMyAssessments);

module.exports = router;
