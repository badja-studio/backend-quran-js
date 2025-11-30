const { Province, City, District, Village } = require('../models');

class MasterRepository {
    // Province methods
    async findAllProvinces() {
        try {
            return await Province.findAll({
                order: [['nama', 'ASC']]
            });
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    async findProvinceById(id) {
        try {
            return await Province.findByPk(id);
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    // City methods
    async findAllCities() {
        try {
            return await City.findAll({
                include: [{
                    model: Province,
                    as: 'province',
                    attributes: ['id', 'kode', 'nama']
                }],
                order: [['nama', 'ASC']]
            });
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    async findCitiesByProvince(provinsiId) {
        try {
            return await City.findAll({
                where: { provinsi_id: provinsiId },
                include: [{
                    model: Province,
                    as: 'province',
                    attributes: ['id', 'kode', 'nama']
                }],
                order: [['nama', 'ASC']]
            });
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    async findCityById(id) {
        try {
            return await City.findByPk(id, {
                include: [{
                    model: Province,
                    as: 'province',
                    attributes: ['id', 'kode', 'nama']
                }]
            });
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    // District methods
    async findAllDistricts() {
        try {
            return await District.findAll({
                include: [{
                    model: City,
                    as: 'city',
                    attributes: ['id', 'kode', 'nama', 'tipe'],
                    include: [{
                        model: Province,
                        as: 'province',
                        attributes: ['id', 'kode', 'nama']
                    }]
                }],
                order: [['nama', 'ASC']]
            });
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    async findDistrictsByCity(kotaId) {
        try {
            return await District.findAll({
                where: { kota_id: kotaId },
                include: [{
                    model: City,
                    as: 'city',
                    attributes: ['id', 'kode', 'nama', 'tipe'],
                    include: [{
                        model: Province,
                        as: 'province',
                        attributes: ['id', 'kode', 'nama']
                    }]
                }],
                order: [['nama', 'ASC']]
            });
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    async findDistrictById(id) {
        try {
            return await District.findByPk(id, {
                include: [{
                    model: City,
                    as: 'city',
                    attributes: ['id', 'kode', 'nama', 'tipe'],
                    include: [{
                        model: Province,
                        as: 'province',
                        attributes: ['id', 'kode', 'nama']
                    }]
                }]
            });
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    // Village methods
    async findAllVillages() {
        try {
            return await Village.findAll({
                include: [{
                    model: District,
                    as: 'district',
                    attributes: ['id', 'kode', 'nama'],
                    include: [{
                        model: City,
                        as: 'city',
                        attributes: ['id', 'kode', 'nama', 'tipe'],
                        include: [{
                            model: Province,
                            as: 'province',
                            attributes: ['id', 'kode', 'nama']
                        }]
                    }]
                }],
                order: [['nama', 'ASC']]
            });
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    async findVillagesByDistrict(kecamatanId) {
        try {
            return await Village.findAll({
                where: { kecamatan_id: kecamatanId },
                include: [{
                    model: District,
                    as: 'district',
                    attributes: ['id', 'kode', 'nama'],
                    include: [{
                        model: City,
                        as: 'city',
                        attributes: ['id', 'kode', 'nama', 'tipe'],
                        include: [{
                            model: Province,
                            as: 'province',
                            attributes: ['id', 'kode', 'nama']
                        }]
                    }]
                }],
                order: [['nama', 'ASC']]
            });
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    async findVillageById(id) {
        try {
            return await Village.findByPk(id, {
                include: [{
                    model: District,
                    as: 'district',
                    attributes: ['id', 'kode', 'nama'],
                    include: [{
                        model: City,
                        as: 'city',
                        attributes: ['id', 'kode', 'nama', 'tipe'],
                        include: [{
                            model: Province,
                            as: 'province',
                            attributes: ['id', 'kode', 'nama']
                        }]
                    }]
                }]
            });
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }
}

module.exports = new MasterRepository();
