const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Village = sequelize.define('Village', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    kecamatan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'districts',
            key: 'id'
        },
        comment: 'ID Kecamatan'
    },
    kode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment: 'Kode Desa/Kelurahan'
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nama Desa/Kelurahan'
    },
    tipe: {
        type: DataTypes.ENUM('KELURAHAN', 'DESA'),
        allowNull: false,
        comment: 'Tipe (KELURAHAN/DESA)'
    }
}, {
    tableName: 'villages',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['kode']
        },
        {
            fields: ['kecamatan_id']
        },
        {
            fields: ['nama']
        },
        {
            fields: ['tipe']
        }
    ]
});

module.exports = Village;
