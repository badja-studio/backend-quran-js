const express = require('express');
const masterController = require('../controller/master.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Master Data
 *   description: Master data endpoints (no authorization required)
 */

/**
 * @swagger
 * /api/master/provinces:
 *   get:
 *     summary: Get all provinces
 *     tags: [Master Data]
 *     responses:
 *       200:
 *         description: Provinces retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Provinces retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       kode:
 *                         type: string
 *                       nama:
 *                         type: string
 */
router.get('/provinces', masterController.getProvinces);

/**
 * @swagger
 * /api/master/provinces/{id}:
 *   get:
 *     summary: Get province by ID
 *     tags: [Master Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Province retrieved successfully
 *       404:
 *         description: Province not found
 */
router.get('/provinces/:id', masterController.getProvinceById);

/**
 * @swagger
 * /api/master/cities:
 *   get:
 *     summary: Get all cities or cities by province
 *     tags: [Master Data]
 *     parameters:
 *       - in: query
 *         name: provinsi_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter cities by province ID
 *     responses:
 *       200:
 *         description: Cities retrieved successfully
 */
router.get('/cities', masterController.getCities);

/**
 * @swagger
 * /api/master/cities/{id}:
 *   get:
 *     summary: Get city by ID
 *     tags: [Master Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: City retrieved successfully
 *       404:
 *         description: City not found
 */
router.get('/cities/:id', masterController.getCityById);

/**
 * @swagger
 * /api/master/districts:
 *   get:
 *     summary: Get all districts or districts by city
 *     tags: [Master Data]
 *     parameters:
 *       - in: query
 *         name: kota_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter districts by city ID
 *     responses:
 *       200:
 *         description: Districts retrieved successfully
 */
router.get('/districts', masterController.getDistricts);

/**
 * @swagger
 * /api/master/districts/{id}:
 *   get:
 *     summary: Get district by ID
 *     tags: [Master Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: District retrieved successfully
 *       404:
 *         description: District not found
 */
router.get('/districts/:id', masterController.getDistrictById);

/**
 * @swagger
 * /api/master/villages:
 *   get:
 *     summary: Get all villages or villages by district
 *     tags: [Master Data]
 *     parameters:
 *       - in: query
 *         name: kecamatan_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter villages by district ID
 *     responses:
 *       200:
 *         description: Villages retrieved successfully
 */
router.get('/villages', masterController.getVillages);

/**
 * @swagger
 * /api/master/villages/{id}:
 *   get:
 *     summary: Get village by ID
 *     tags: [Master Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Village retrieved successfully
 *       404:
 *         description: Village not found
 */
router.get('/villages/:id', masterController.getVillageById);

// Specific routes for getting child data by parent ID
/**
 * @swagger
 * /api/master/provinces/{provinceId}/cities:
 *   get:
 *     summary: Get all cities in a specific province
 *     tags: [Master Data]
 *     parameters:
 *       - in: path
 *         name: provinceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Province ID
 *     responses:
 *       200:
 *         description: Cities retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/provinces/:provinceId/cities', masterController.getCitiesByProvinceId);

/**
 * @swagger
 * /api/master/cities/{cityId}/districts:
 *   get:
 *     summary: Get all districts in a specific city
 *     tags: [Master Data]
 *     parameters:
 *       - in: path
 *         name: cityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: City ID
 *     responses:
 *       200:
 *         description: Districts retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/cities/:cityId/districts', masterController.getDistrictsByCityId);

/**
 * @swagger
 * /api/master/districts/{districtId}/villages:
 *   get:
 *     summary: Get all villages in a specific district
 *     tags: [Master Data]
 *     parameters:
 *       - in: path
 *         name: districtId
 *         required: true
 *         schema:
 *           type: integer
 *         description: District ID
 *     responses:
 *       200:
 *         description: Villages retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/districts/:districtId/villages', masterController.getVillagesByDistrictId);

module.exports = router;
