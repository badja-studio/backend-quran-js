const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const City = sequelize.define('City', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    provinsi_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'provinces',
            key: 'id'
        },
        comment: 'ID Provinsi'
    },
    kode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        comment: 'Kode Kab/Kota'
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nama Kab/Kota'
    },
    tipe: {
        type: DataTypes.ENUM('KABUPATEN', 'KOTA'),
        allowNull: false,
        comment: 'Tipe (KABUPATEN/KOTA)'
    }
}, {
    tableName: 'cities',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['kode']
        },
        {
            fields: ['provinsi_id']
        },
        {
            fields: ['nama']
        },
        {
            fields: ['tipe']
        }
    ]
});

module.exports = City;
