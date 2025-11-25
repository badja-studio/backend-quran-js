const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AssesseeSchedule = sequelize.define('AssesseeSchedule', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    assesseeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    scheduleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'schedules',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'assessee_schedules',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['assesseeId', 'scheduleId']
        }
    ]
});

module.exports = AssesseeSchedule;
