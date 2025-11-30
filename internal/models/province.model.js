const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Province = sequelize.define('Province', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    kode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        comment: 'Kode Provinsi'
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nama Provinsi'
    }
}, {
    tableName: 'provinces',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['kode']
        },
        {
            fields: ['nama']
        }
    ]
});

module.exports = Province;
