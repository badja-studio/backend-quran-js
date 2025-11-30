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
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
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
        comment: 'Provinsi'
    },
    kab_kota: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Kabupaten/Kota'
    },
    kecamatan: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Kecamatan'
    },
    desa_kelurahan: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Desa/Kelurahan'
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
    pegawai:{
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Status Pegawai'
    },
    status_pegawai: {
        type: DataTypes.ENUM('PNS', 'PPPK', 'NON_PNS'),
        allowNull: true,
        comment: 'Status Pegawai (PNS/PPPK/NON_PNS)'
    },
    sertifikasi: {
        type: DataTypes.ENUM('SUDAH', 'BELUM'),
        allowNull: true,
        comment: 'Status Sertifikasi (SUDAH/BELUM)'
    },
    tahun_sertifikasi: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Tahun Sertifikasi'
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
        type: DataTypes.ENUM('SUDAH', 'BELUM'),
        allowNull: false,
        defaultValue: 'BELUM',
        comment: 'Status Asesmen (SUDAH/BELUM)'
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
