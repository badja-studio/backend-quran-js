// Import all models
const User = require('./user.model');
const Participant = require('./participant.model');
const Assessor = require('./assessor.model');
const Assessment = require('./assessment.model');
const Admin = require('./admin.model');
const Province = require('./province.model');
const City = require('./city.model');
const District = require('./district.model');
const Village = require('./village.model');

// Setup associations
function setupAssociations() {
    // User associations
    User.hasOne(Participant, {
        foreignKey: 'akun_id',
        as: 'participant'
    });

    User.hasOne(Assessor, {
        foreignKey: 'akun_id',
        as: 'assessor'
    });

    User.hasOne(Admin, {
        foreignKey: 'user_id',
        as: 'admin'
    });

    // Participant associations
    Participant.belongsTo(User, {
        foreignKey: 'akun_id',
        as: 'akun'
    });

    Participant.belongsTo(Assessor, {
        foreignKey: 'asesor_id',
        as: 'assessor'
    });

    Participant.hasMany(Assessment, {
        foreignKey: 'peserta_id',
        as: 'assessments'
    });

    // Assessor associations
    Assessor.belongsTo(User, {
        foreignKey: 'akun_id',
        as: 'akun'
    });

    Assessor.hasMany(Participant, {
        foreignKey: 'asesor_id',
        as: 'participants'
    });

    // Admin associations
    Admin.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });

    Assessor.hasMany(Assessment, {
        foreignKey: 'asesor_id',
        as: 'assessor_assessments'
    });

    // Assessment associations
    Assessment.belongsTo(Participant, {
        foreignKey: 'peserta_id',
        as: 'peserta'
    });

    Assessment.belongsTo(Assessor, {
        foreignKey: 'asesor_id',
        as: 'assessor'
    });

    // Master data associations
    // Province has many cities
    Province.hasMany(City, {
        foreignKey: 'provinsi_id',
        as: 'cities'
    });

    // City belongs to province and has many districts
    City.belongsTo(Province, {
        foreignKey: 'provinsi_id',
        as: 'province'
    });

    City.hasMany(District, {
        foreignKey: 'kota_id',
        as: 'districts'
    });

    // District belongs to city and has many villages
    District.belongsTo(City, {
        foreignKey: 'kota_id',
        as: 'city'
    });

    District.hasMany(Village, {
        foreignKey: 'kecamatan_id',
        as: 'villages'
    });

    // Village belongs to district
    Village.belongsTo(District, {
        foreignKey: 'kecamatan_id',
        as: 'district'
    });
}

// Setup associations
setupAssociations();

// Export all models
module.exports = {
    User,
    Participant,
    Assessor,
    Assessment,
    Admin,
    Province,
    City,
    District,
    Village
};
