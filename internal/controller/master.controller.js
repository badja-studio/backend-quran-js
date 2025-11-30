const masterRepository = require('../repository/master.repository');

class MasterController {
    // Province endpoints
    async getProvinces(req, res) {
        try {
            const provinces = await masterRepository.findAllProvinces();
            
            res.status(200).json({
                status: 'success',
                message: 'Provinces retrieved successfully',
                data: provinces
            });
        } catch (error) {
            console.error('Get provinces error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getProvinceById(req, res) {
        try {
            const { id } = req.params;
            const province = await masterRepository.findProvinceById(id);
            
            if (!province) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Province not found'
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'Province retrieved successfully',
                data: province
            });
        } catch (error) {
            console.error('Get province by id error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // City endpoints
    async getCities(req, res) {
        try {
            const { provinsi_id } = req.query;
            let cities;

            if (provinsi_id) {
                cities = await masterRepository.findCitiesByProvince(provinsi_id);
            } else {
                cities = await masterRepository.findAllCities();
            }
            
            res.status(200).json({
                status: 'success',
                message: 'Cities retrieved successfully',
                data: cities
            });
        } catch (error) {
            console.error('Get cities error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getCityById(req, res) {
        try {
            const { id } = req.params;
            const city = await masterRepository.findCityById(id);
            
            if (!city) {
                return res.status(404).json({
                    status: 'error',
                    message: 'City not found'
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'City retrieved successfully',
                data: city
            });
        } catch (error) {
            console.error('Get city by id error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // District endpoints
    async getDistricts(req, res) {
        try {
            const { kota_id } = req.query;
            let districts;

            if (kota_id) {
                districts = await masterRepository.findDistrictsByCity(kota_id);
            } else {
                districts = await masterRepository.findAllDistricts();
            }
            
            res.status(200).json({
                status: 'success',
                message: 'Districts retrieved successfully',
                data: districts
            });
        } catch (error) {
            console.error('Get districts error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getDistrictById(req, res) {
        try {
            const { id } = req.params;
            const district = await masterRepository.findDistrictById(id);
            
            if (!district) {
                return res.status(404).json({
                    status: 'error',
                    message: 'District not found'
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'District retrieved successfully',
                data: district
            });
        } catch (error) {
            console.error('Get district by id error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Village endpoints
    async getVillages(req, res) {
        try {
            const { kecamatan_id } = req.query;
            let villages;

            if (kecamatan_id) {
                villages = await masterRepository.findVillagesByDistrict(kecamatan_id);
            } else {
                villages = await masterRepository.findAllVillages();
            }
            
            res.status(200).json({
                status: 'success',
                message: 'Villages retrieved successfully',
                data: villages
            });
        } catch (error) {
            console.error('Get villages error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getVillageById(req, res) {
        try {
            const { id } = req.params;
            const village = await masterRepository.findVillageById(id);
            
            if (!village) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Village not found'
                });
            }

            res.status(200).json({
                status: 'success',
                message: 'Village retrieved successfully',
                data: village
            });
        } catch (error) {
            console.error('Get village by id error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    // Specific endpoints with path parameters
    async getCitiesByProvinceId(req, res) {
        try {
            const { provinceId } = req.params;
            const cities = await masterRepository.findCitiesByProvince(provinceId);
            
            res.status(200).json({
                status: 'success',
                message: `Cities in province ${provinceId} retrieved successfully`,
                data: cities
            });
        } catch (error) {
            console.error('Get cities by province id error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getDistrictsByCityId(req, res) {
        try {
            const { cityId } = req.params;
            const districts = await masterRepository.findDistrictsByCity(cityId);
            
            res.status(200).json({
                status: 'success',
                message: `Districts in city ${cityId} retrieved successfully`,
                data: districts
            });
        } catch (error) {
            console.error('Get districts by city id error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getVillagesByDistrictId(req, res) {
        try {
            const { districtId } = req.params;
            const villages = await masterRepository.findVillagesByDistrict(districtId);
            
            res.status(200).json({
                status: 'success',
                message: `Villages in district ${districtId} retrieved successfully`,
                data: villages
            });
        } catch (error) {
            console.error('Get villages by district id error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = new MasterController();
