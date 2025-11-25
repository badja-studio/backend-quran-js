// Import all models
const User = require('./user.model');
const CriteriaGroup = require('./criteriaGroup.model');
const Criterion = require('./criterion.model');
const Schedule = require('./schedule.model');
const AssesseeSchedule = require('./assesseeSchedule.model');
const AssesseeAssessor = require('./assesseeAssessor.model');
const AssesseeGroup = require('./assesseeGroup.model');
const Assessment = require('./assessment.model');
const Surah = require('./surah.model');

// Setup associations
function setupAssociations() {
    // CriteriaGroup associations
    CriteriaGroup.hasMany(Criterion, {
        foreignKey: 'criteriaGroupId',
        as: 'criteria'
    });

    // Criterion associations
    Criterion.belongsTo(CriteriaGroup, {
        foreignKey: 'criteriaGroupId',
        as: 'criteriaGroup'
    });

    Criterion.hasMany(Assessment, {
        foreignKey: 'criterionId',
        as: 'assessments'
    });

    // Schedule associations
    Schedule.belongsToMany(User, {
        through: AssesseeSchedule,
        foreignKey: 'scheduleId',
        otherKey: 'assesseeId',
        as: 'assessees'
    });

    // User associations for Schedule (reverse)
    User.belongsToMany(Schedule, {
        through: AssesseeSchedule,
        foreignKey: 'assesseeId',
        otherKey: 'scheduleId',
        as: 'schedules'
    });

    // Assessee-Assessor associations
    User.belongsToMany(User, {
        through: AssesseeAssessor,
        foreignKey: 'assesseeId',
        otherKey: 'assessorId',
        as: 'assessors'
    });

    User.belongsToMany(User, {
        through: AssesseeAssessor,
        foreignKey: 'assessorId',
        otherKey: 'assesseeId',
        as: 'assessees'
    });

    // Assessee-CriteriaGroup associations
    User.belongsToMany(CriteriaGroup, {
        through: AssesseeGroup,
        foreignKey: 'assesseeId',
        otherKey: 'criteriaGroupId',
        as: 'criteriaGroups'
    });

    CriteriaGroup.belongsToMany(User, {
        through: AssesseeGroup,
        foreignKey: 'criteriaGroupId',
        otherKey: 'assesseeId',
        as: 'assignedAssessees'
    });

    // Assessment associations
    Assessment.belongsTo(User, {
        foreignKey: 'assesseeId',
        as: 'assessee'
    });

    Assessment.belongsTo(User, {
        foreignKey: 'assessorId',
        as: 'assessor'
    });

    Assessment.belongsTo(Criterion, {
        foreignKey: 'criterionId',
        as: 'criterion'
    });

    // User associations for Assessment
    User.hasMany(Assessment, {
        foreignKey: 'assesseeId',
        as: 'receivedAssessments'
    });

    User.hasMany(Assessment, {
        foreignKey: 'assessorId',
        as: 'givenAssessments'
    });
}

// Setup associations
setupAssociations();

// Export all models
module.exports = {
    User,
    CriteriaGroup,
    Criterion,
    Schedule,
    AssesseeSchedule,
    AssesseeAssessor,
    AssesseeGroup,
    Assessment,
    Surah
};
