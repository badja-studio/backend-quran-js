const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const District = sequelize.define('District', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    kota_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'cities',
            key: 'id'
        },
        comment: 'ID Kab/Kota'
    },
    kode: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
        comment: 'Kode Kecamatan'
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nama Kecamatan'
    }
}, {
    tableName: 'districts',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['kode']
        },
        {
            fields: ['kota_id']
        },
        {
            fields: ['nama']
        }
    ]
});

module.exports = District;
