const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Criterion = sequelize.define('Criterion', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    criteriaGroupId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'criteria_groups',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    maxScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100
    },
    weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 1.0
    }
}, {
    tableName: 'criteria',
    timestamps: true
});

module.exports = Criterion;
