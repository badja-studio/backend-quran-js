const express = require('express');
const router = express.Router();
const assesseeController = require('../controller/assessee.controller');

// Profile Route
router.get('/profile', assesseeController.getProfile);

// Assessment Routes
router.get('/assessments', assesseeController.getMyAssessments);
router.get('/summary', assesseeController.getAssessmentSummary);

// Schedule Route
router.get('/schedule', assesseeController.getMySchedule);

module.exports = router;
