const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');

// Criteria Group Routes
router.post('/criteria-groups', adminController.createCriteriaGroup);
router.get('/criteria-groups', adminController.getCriteriaGroups);
router.get('/criteria-groups/:id', adminController.getCriteriaGroupById);
router.put('/criteria-groups/:id', adminController.updateCriteriaGroup);
router.delete('/criteria-groups/:id', adminController.deleteCriteriaGroup);

// Criterion Routes
router.post('/criteria-groups/:groupId/criteria', adminController.addCriterion);
router.put('/criteria/:id', adminController.updateCriterion);
router.delete('/criteria/:id', adminController.deleteCriterion);

// Schedule Routes
router.post('/schedules', adminController.createSchedule);
router.get('/schedules', adminController.getSchedules);
router.get('/schedules/:id', adminController.getScheduleById);
router.put('/schedules/:id', adminController.updateSchedule);
router.delete('/schedules/:id', adminController.deleteSchedule);
router.post('/schedules/:id/add-assessees', adminController.addAssesseesToSchedule);
router.delete('/schedules/:scheduleId/assessees/:assesseeId', adminController.removeAssesseeFromSchedule);

// Assessee Routes
router.get('/assessees', adminController.getAllAssessees);
router.get('/assessees/:id', adminController.getAssesseeById);
router.post('/assessees/:id/assign-assessor', adminController.assignAssessorToAssessee);
router.delete('/assessees/:assesseeId/assessors/:assessorId', adminController.removeAssessorFromAssessee);
router.post('/assessees/:id/assign-group', adminController.assignCriteriaGroupToAssessee);

// Assessor Routes
router.get('/assessors', adminController.getAllAssessors);
router.get('/assessors/:id/assessees', adminController.getAssessorAssessees);

module.exports = router;
