const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Assessment = sequelize.define('Assessment', {
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
    },
    criterionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'criteria',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'assessments',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['assesseeId', 'assessorId', 'criterionId']
        }
    ]
});

module.exports = Assessment;
