const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Participant = sequelize.define('Participant', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    no_akun: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Nomor Akun Peserta'
    },
    nip: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'NIP Peserta'
    },
    nik: {
        type: DataTypes.STRING(16),
        allowNull: true,
        comment: 'NIK Peserta'
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Nama Lengkap Peserta'
    },
    jenis_kelamin: {
        type: DataTypes.ENUM('L', 'P'),
        allowNull: false,
        comment: 'Jenis Kelamin (L = Laki-laki, P = Perempuan)'
    },
    tempat_lahir: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Tempat Lahir'
    },
    tanggal_lahir: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Tanggal Lahir'
    },
    tingkat_pendidikan: {
        type: DataTypes.ENUM('SD', 'SMP', 'SMA', 'DIPLOMA', 'SARJANA', 'MAGISTER', 'DOKTOR'),
        allowNull: true,
        comment: 'Tingkat Pendidikan'
    },
    alamat_lengkap: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Alamat Lengkap'
    },
    provinsi: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Nama Provinsi'
    },
    kota: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Nama Kota/Kabupaten'
    },
    kecamatan: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Nama Kecamatan'
    },
    kelurahan: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Nama Kelurahan/Desa'
    },
    kode_pos: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: 'Kode Pos'
    },
    status_pegawai: {
        type: DataTypes.ENUM('PNS', 'PPPK', 'HONORER', 'KONTRAK'),
        allowNull: true,
        comment: 'Status Kepegawaian'
    },
    usia_pegawai: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Usia sebagai Pegawai'
    },
    sertifikat_profesi: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Sertifikat Profesi yang dimiliki'
    },
    jabatan: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Jabatan'
    },
    jenjang: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Jenjang'
    },
    level: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Level'
    },
    provinsi: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Nama Provinsi'
    },
    sekolah: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Nama Sekolah'
    },
    pendidikan: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Pendidikan Terakhir'
    },
    prodi: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Program Studi'
    },
    perguruan_tinggi: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Nama Perguruan Tinggi'
    },
    asal_kampus: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Asal Kampus'
    },
    fakultas: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Fakultas'
    },
    jenis_pt: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Jenis Perguruan Tinggi'
    },
    tahun_lulus: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Tahun Lulus'
    },
    tingkat_sekolah: {
        type: DataTypes.ENUM('MI', 'MTs', 'MA'),
        allowNull: true,
        comment: 'Tingkat Sekolah (MI/MTs/MA)'
    },
    nama_sekolah: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Nama Sekolah'
    },
    alamat_sekolah: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Alamat Sekolah'
    },
    usia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Usia Peserta'
    },

    jadwal: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Jadwal Asesmen'
    },
    asesor_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Assessors',
            key: 'id'
        },
        comment: 'ID Asesor yang ditugaskan'
    },
    status: {
        type: DataTypes.ENUM('BELUM', 'PROSES', 'SELESAI'),
        allowNull: false,
        defaultValue: 'BELUM',
        comment: 'Status Asesmen (BELUM/PROSES/SELESAI)'
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
    tableName: 'participants',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['no_akun']
        },
        {
            unique: true,
            fields: ['nip']
        },
        {
            fields: ['asesor_id']
        },
        {
            fields: ['akun_id']
        },
        {
            fields: ['status']
        }
    ]
});

module.exports = Participant;
