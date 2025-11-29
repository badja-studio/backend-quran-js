const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Assessor = sequelize.define('Assessor', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Nama Lengkap Assessor'
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Username untuk login'
    },
    no_telepon: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Nomor Telepon'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        },
        comment: 'Email Assessor'
    },
    link_grup_wa: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Link Grup WhatsApp'
    },
    total_peserta_belum_asesmen: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total Peserta yang Belum Dinilai'
    },
    total_peserta_selesai_asesmen: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total Peserta yang Sudah Dinilai'
    },
    akun_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        comment: 'ID Akun User untuk login'
    }
}, {
    tableName: 'assessors',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['username']
        },
        {
            fields: ['akun_id']
        },
        {
            fields: ['email']
        }
    ]
});

module.exports = Assessor;
