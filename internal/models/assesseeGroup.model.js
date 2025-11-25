const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AssesseeGroup = sequelize.define('AssesseeGroup', {
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
    criteriaGroupId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'criteria_groups',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'assessee_groups',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['assesseeId', 'criteriaGroupId']
        }
    ]
});

module.exports = AssesseeGroup;
