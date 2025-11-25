const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AssesseeAssessor = sequelize.define('AssesseeAssessor', {
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
    assessorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'assessee_assessors',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['assesseeId', 'assessorId']
        }
    ]
});

module.exports = AssesseeAssessor;
