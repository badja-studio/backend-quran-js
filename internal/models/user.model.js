const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Username/NIP untuk login'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Password untuk login'
    },
    role: {
        type: DataTypes.ENUM('participant', 'assessor', 'admin'),
        allowNull: false,
        defaultValue: 'participant',
        comment: 'Role user'
    }
}, {
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Instance method to compare password
User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
};

module.exports = User;
