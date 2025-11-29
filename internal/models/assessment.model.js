const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Assessment = sequelize.define('Assessment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    peserta_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'participants',
            key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'ID Peserta yang dinilai'
    },
    asesor_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'assessors',
            key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'ID Asesor yang menilai'
    },
    huruf: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Huruf/Aspek yang dinilai (A, B, C, dst)'
    },
    nilai: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Nilai yang diberikan'
    },
    kategori: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Kategori penilaian'
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
