const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const CriteriaGroup = sequelize.define('CriteriaGroup', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'criteria_groups',
    timestamps: true
});

module.exports = CriteriaGroup;
