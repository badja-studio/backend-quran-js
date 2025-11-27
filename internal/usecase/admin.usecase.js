const criteriaGroupRepo = require('../repository/criteriaGroup.repository');
const criterionRepo = require('../repository/criterion.repository');
const scheduleRepo = require('../repository/schedule.repository');
const assesseeAssessorRepo = require('../repository/assesseeAssessor.repository');
const assesseeGroupRepo = require('../repository/assesseeGroup.repository');
const assessmentRepo = require('../repository/assessment.repository');
const authRepo = require('../repository/auth.repository');
const assesseeRepo = require('../repository/assessee.repository');

class AdminUseCase {
    // ==================== CRITERIA GROUP MANAGEMENT ====================
    
    async createCriteriaGroup(data) {
        try {
            const { name, description } = data;
            
            if (!name) {
                throw new Error('Criteria group name is required');
            }

            const group = await criteriaGroupRepo.create({ name, description });
            
            return {
                success: true,
                message: 'Criteria group created successfully',
                data: group
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async getCriteriaGroups() {
        try {
            const groups = await criteriaGroupRepo.findAll();
            
            return {
                success: true,
                data: groups
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async getCriteriaGroupById(id) {
        try {
            const group = await criteriaGroupRepo.findById(id);
            
            if (!group) {
                throw new Error('Criteria group not found');
            }

            return {
                success: true,
                data: group
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async updateCriteriaGroup(id, data) {
        try {
            const group = await criteriaGroupRepo.update(id, data);
            
            if (!group) {
                throw new Error('Criteria group not found');
            }

            return {
                success: true,
                message: 'Criteria group updated successfully',
                data: group
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async deleteCriteriaGroup(id) {
        try {
            const deleted = await criteriaGroupRepo.delete(id);
            
            if (!deleted) {
                throw new Error('Criteria group not found');
            }

            return {
                success: true,
                message: 'Criteria group deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // ==================== CRITERION MANAGEMENT ====================
    
    async addCriterion(criteriaGroupId, data) {
        try {
            const { name, description, maxScore, weight } = data;
            
            if (!name) {
                throw new Error('Criterion name is required');
            }

            // Verify criteria group exists
            const group = await criteriaGroupRepo.findById(criteriaGroupId);
            if (!group) {
                throw new Error('Criteria group not found');
            }

            const criterion = await criterionRepo.create({
                criteriaGroupId,
                name,
                description,
                maxScore: maxScore || 100,
                weight: weight || 1.0
            });

            return {
                success: true,
                message: 'Criterion added successfully',
                data: criterion
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async updateCriterion(id, data) {
        try {
            const criterion = await criterionRepo.update(id, data);
            
            if (!criterion) {
                throw new Error('Criterion not found');
            }

            return {
                success: true,
                message: 'Criterion updated successfully',
                data: criterion
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async deleteCriterion(id) {
        try {
            const deleted = await criterionRepo.delete(id);
            
            if (!deleted) {
                throw new Error('Criterion not found');
            }

            return {
                success: true,
                message: 'Criterion deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // ==================== SCHEDULE MANAGEMENT ====================
    
    async createSchedule(data) {
        try {
            const { name, date, startTime, endTime } = data;
            
            if (!name || !date || !startTime || !endTime) {
                throw new Error('All schedule fields are required');
            }

            const schedule = await scheduleRepo.create({ name, date, startTime, endTime });
            
            return {
                success: true,
                message: 'Schedule created successfully',
                data: schedule
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async getSchedules() {
        try {
            const schedules = await scheduleRepo.findAll();
            
            return {
                success: true,
                data: schedules
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async getScheduleById(id) {
        try {
            const schedule = await scheduleRepo.findById(id);
            
            if (!schedule) {
                throw new Error('Schedule not found');
            }

            return {
                success: true,
                data: schedule
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async updateSchedule(id, data) {
        try {
            const schedule = await scheduleRepo.update(id, data);
            
            if (!schedule) {
                throw new Error('Schedule not found');
            }

            return {
                success: true,
                message: 'Schedule updated successfully',
                data: schedule
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async deleteSchedule(id) {
        try {
            const deleted = await scheduleRepo.delete(id);
            
            if (!deleted) {
                throw new Error('Schedule not found');
            }

            return {
                success: true,
                message: 'Schedule deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async addAssesseesToSchedule(scheduleId, assesseeIds) {
        try {
            if (!Array.isArray(assesseeIds) || assesseeIds.length === 0) {
                throw new Error('Assessee IDs array is required');
            }

            await scheduleRepo.addAssessees(scheduleId, assesseeIds);
            
            return {
                success: true,
                message: 'Assessees added to schedule successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async removeAssesseeFromSchedule(scheduleId, assesseeId) {
        try {
            const removed = await scheduleRepo.removeAssessee(scheduleId, assesseeId);
            
            if (!removed) {
                throw new Error('Assessee not found in schedule');
            }

            return {
                success: true,
                message: 'Assessee removed from schedule successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // ==================== ASSESSEE MANAGEMENT ====================
    
    async getAllAssessees(page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'DESC') {
        try {
            const result = await assesseeRepo.findWithPagination({
                page,
                limit,
                search,
                sortBy,
                sortOrder
            });

            return {
                success: true,
                message: 'Assessees retrieved successfully',
                data: {
                    assessees: result.data,
                    pagination: result.pagination
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async getAssesseesNotAssessed(page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'DESC') {
        try {
            const result = await assesseeRepo.findNotAssessed({
                page,
                limit,
                search,
                sortBy,
                sortOrder
            });

            return {
                success: true,
                message: 'Assessees not assessed retrieved successfully',
                data: {
                    assessees: result.data,
                    pagination: result.pagination
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async getAssesseesReadyForAssessment(page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'DESC') {
        try {
            const result = await assesseeRepo.findReadyForAssessment({
                page,
                limit,
                search,
                sortBy,
                sortOrder
            });

            return {
                success: true,
                message: 'Assessees ready for assessment retrieved successfully',
                data: {
                    assessees: result.data,
                    pagination: result.pagination
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async getAssesseesWithResults(page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'DESC') {
        try {
            const result = await assesseeRepo.findWithResults({
                page,
                limit,
                search,
                sortBy,
                sortOrder
            });

            return {
                success: true,
                message: 'Assessees with results retrieved successfully',
                data: {
                    assessees: result.data,
                    pagination: result.pagination
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async getAssesseeById(id) {
        try {
            const { User } = require('../models');
            const assessee = await User.findByPk(id, {
                attributes: { exclude: ['password'] }
            });

            if (!assessee || assessee.roles !== 'Assessee') {
                throw new Error('Assessee not found');
            }

            // Get assessors
            const assessors = await assesseeAssessorRepo.getAssessorsForAssessee(id);
            
            // Get criteria group
            const criteriaGroup = await assesseeGroupRepo.getCriteriaGroupForAssessee(id);
            
            // Get assessments
            const assessments = await assessmentRepo.getAssessmentsForAssessee(id);

            return {
                success: true,
                data: {
                    ...assessee.toJSON(),
                    assessors,
                    criteriaGroup,
                    assessments
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async assignAssessorToAssessee(assesseeId, assessorId) {
        try {
            // Verify assessee exists
            const assessee = await authRepo.findById(assesseeId);
            if (!assessee || assessee.roles !== 'Assessee') {
                throw new Error('Assessee not found');
            }

            // Verify assessor exists
            const assessor = await authRepo.findById(assessorId);
            if (!assessor || assessor.roles !== 'Assessor') {
                throw new Error('Assessor not found');
            }

            await assesseeAssessorRepo.assign(assesseeId, assessorId);

            return {
                success: true,
                message: 'Assessor assigned successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async removeAssessorFromAssessee(assesseeId, assessorId) {
        try {
            const removed = await assesseeAssessorRepo.remove(assesseeId, assessorId);
            
            if (!removed) {
                throw new Error('Assessor assignment not found');
            }

            return {
                success: true,
                message: 'Assessor removed successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async assignCriteriaGroupToAssessee(assesseeId, criteriaGroupId) {
        try {
            // Verify assessee exists
            const assessee = await authRepo.findById(assesseeId);
            if (!assessee || assessee.roles !== 'Assessee') {
                throw new Error('Assessee not found');
            }

            // Verify criteria group exists
            const group = await criteriaGroupRepo.findById(criteriaGroupId);
            if (!group) {
                throw new Error('Criteria group not found');
            }

            await assesseeGroupRepo.assign(assesseeId, criteriaGroupId);

            return {
                success: true,
                message: 'Criteria group assigned successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    // ==================== ASSESSOR MANAGEMENT ====================
    
    async getAllAssessors() {
        try {
            const { User } = require('../models');
            const assessors = await User.findAll({
                where: { roles: 'Assessor' },
                attributes: { exclude: ['password'] }
            });

            return {
                success: true,
                data: assessors
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    async getAssessorAssessees(assessorId) {
        try {
            const assessees = await assesseeAssessorRepo.getAssesseesForAssessor(assessorId);

            return {
                success: true,
                data: assessees
            };
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

module.exports = new AdminUseCase();
