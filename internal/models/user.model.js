const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    siagaNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        index: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        comment: 'No. Akun'
    },
    nip: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Nomor Induk Pegawai'
    },
    gender: {
        type: DataTypes.ENUM('L', 'P'),
        allowNull: true,
        comment: 'Jenis Kelamin: L=Laki-laki, P=Perempuan'
    },
    birthPlace: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Tempat Lahir'
    },
    position: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Jabatan/Pegawai'
    },
    province: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Provinsi'
    },
    schoolLevels: {
        type: DataTypes.STRING,
        allowNull: true
    },
    schoolName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    levels: {
        type: DataTypes.STRING,
        allowNull: true
    },
    district: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Kabupaten/Kotamadya'
    },
    education: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Pendidikan Terakhir (D3, S1, S2, S3)'
    },
    studyProgram: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Program Studi'
    },
    university: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Perguruan Tinggi'
    },
    universityType: {
        type: DataTypes.ENUM('Negeri', 'Swasta'),
        allowNull: true,
        comment: 'Jenis Perguruan Tinggi'
    },
    graduationYear: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Tahun Lulus'
    },
    waLink: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'WhatsApp link for Assessor'
    },
    roles: {
        type: DataTypes.ENUM('Admin', 'Assessor', 'Assessee'),
        allowNull: false,
        defaultValue: 'Assessee'
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
