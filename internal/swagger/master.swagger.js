/**
 * @swagger
 * components:
 *   schemas:
 *     Province:
 *       type: object
 *       required:
 *         - kode
 *         - nama
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the province
 *           example: 1
 *         kode:
 *           type: string
 *           maxLength: 2
 *           description: Province code (2 digits)
 *           example: "31"
 *         nama:
 *           type: string
 *           description: Province name
 *           example: "DKI JAKARTA"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     
 *     City:
 *       type: object
 *       required:
 *         - provinsi_id
 *         - kode
 *         - nama
 *         - tipe
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the city
 *           example: 101
 *         provinsi_id:
 *           type: integer
 *           description: Province ID reference
 *           example: 1
 *         kode:
 *           type: string
 *           maxLength: 4
 *           description: City/Regency code (4 digits)
 *           example: "3174"
 *         nama:
 *           type: string
 *           description: City/Regency name
 *           example: "JAKARTA PUSAT"
 *         tipe:
 *           type: string
 *           enum: [KABUPATEN, KOTA]
 *           description: City type (KABUPATEN/KOTA)
 *           example: "KOTA"
 *         province:
 *           $ref: '#/components/schemas/Province'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     
 *     District:
 *       type: object
 *       required:
 *         - kota_id
 *         - kode
 *         - nama
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the district
 *           example: 1001
 *         kota_id:
 *           type: integer
 *           description: City ID reference
 *           example: 101
 *         kode:
 *           type: string
 *           maxLength: 7
 *           description: District code (7 digits)
 *           example: "3174060"
 *         nama:
 *           type: string
 *           description: District name
 *           example: "MENTENG"
 *         city:
 *           $ref: '#/components/schemas/City'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     
 *     Village:
 *       type: object
 *       required:
 *         - kecamatan_id
 *         - kode
 *         - nama
 *         - tipe
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the village
 *           example: 10001
 *         kecamatan_id:
 *           type: integer
 *           description: District ID reference
 *           example: 1001
 *         kode:
 *           type: string
 *           maxLength: 10
 *           description: Village code (10 digits)
 *           example: "3174060001"
 *         nama:
 *           type: string
 *           description: Village/Sub-district name
 *           example: "MENTENG"
 *         tipe:
 *           type: string
 *           enum: [DESA, KELURAHAN]
 *           description: Village type (DESA/KELURAHAN)
 *           example: "KELURAHAN"
 *         district:
 *           $ref: '#/components/schemas/District'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     
 *     MasterDataResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: "Data retrieved successfully"
 *         data:
 *           type: array
 *           items:
 *             oneOf:
 *               - $ref: '#/components/schemas/Province'
 *               - $ref: '#/components/schemas/City'
 *               - $ref: '#/components/schemas/District'
 *               - $ref: '#/components/schemas/Village'
 */

/**
 * @swagger
 * /api/master/provinces:
 *   get:
 *     summary: Get all provinces
 *     tags: [Master Data]
 *     description: Retrieve all provinces in Indonesia
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
 *                   example: "Provinces retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Province'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Database error"
 */

/**
 * @swagger
 * /api/master/provinces/{id}:
 *   get:
 *     summary: Get province by ID
 *     tags: [Master Data]
 *     description: Retrieve a specific province by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Province ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Province retrieved successfully
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
 *                   example: "Province retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Province'
 *       404:
 *         description: Province not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Province not found"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/master/cities:
 *   get:
 *     summary: Get all cities or filter by province
 *     tags: [Master Data]
 *     description: Retrieve all cities or filter by province ID using query parameter
 *     parameters:
 *       - in: query
 *         name: provinsi_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter cities by province ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Cities retrieved successfully
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
 *                   example: "Cities retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/City'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/master/cities/{id}:
 *   get:
 *     summary: Get city by ID
 *     tags: [Master Data]
 *     description: Retrieve a specific city by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: City ID
 *         example: 101
 *     responses:
 *       200:
 *         description: City retrieved successfully
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
 *                   example: "City retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/City'
 *       404:
 *         description: City not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/master/districts:
 *   get:
 *     summary: Get all districts or filter by city
 *     tags: [Master Data]
 *     description: Retrieve all districts or filter by city ID using query parameter
 *     parameters:
 *       - in: query
 *         name: kota_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter districts by city ID
 *         example: 101
 *     responses:
 *       200:
 *         description: Districts retrieved successfully
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
 *                   example: "Districts retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/District'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/master/districts/{id}:
 *   get:
 *     summary: Get district by ID
 *     tags: [Master Data]
 *     description: Retrieve a specific district by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: District ID
 *         example: 1001
 *     responses:
 *       200:
 *         description: District retrieved successfully
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
 *                   example: "District retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/District'
 *       404:
 *         description: District not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/master/villages:
 *   get:
 *     summary: Get all villages or filter by district
 *     tags: [Master Data]
 *     description: Retrieve all villages or filter by district ID using query parameter
 *     parameters:
 *       - in: query
 *         name: kecamatan_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter villages by district ID
 *         example: 1001
 *     responses:
 *       200:
 *         description: Villages retrieved successfully
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
 *                   example: "Villages retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Village'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/master/villages/{id}:
 *   get:
 *     summary: Get village by ID
 *     tags: [Master Data]
 *     description: Retrieve a specific village by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Village ID
 *         example: 10001
 *     responses:
 *       200:
 *         description: Village retrieved successfully
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
 *                   example: "Village retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Village'
 *       404:
 *         description: Village not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/master/provinces/{provinceId}/cities:
 *   get:
 *     summary: Get all cities in a specific province
 *     tags: [Master Data]
 *     description: Retrieve all cities within a specific province using path parameter
 *     parameters:
 *       - in: path
 *         name: provinceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Province ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Cities retrieved successfully
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
 *                   example: "Cities in province 1 retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/City'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/master/cities/{cityId}/districts:
 *   get:
 *     summary: Get all districts in a specific city
 *     tags: [Master Data]
 *     description: Retrieve all districts within a specific city using path parameter
 *     parameters:
 *       - in: path
 *         name: cityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: City ID
 *         example: 101
 *     responses:
 *       200:
 *         description: Districts retrieved successfully
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
 *                   example: "Districts in city 101 retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/District'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/master/districts/{districtId}/villages:
 *   get:
 *     summary: Get all villages in a specific district
 *     tags: [Master Data]
 *     description: Retrieve all villages within a specific district using path parameter
 *     parameters:
 *       - in: path
 *         name: districtId
 *         required: true
 *         schema:
 *           type: integer
 *         description: District ID
 *         example: 1001
 *     responses:
 *       200:
 *         description: Villages retrieved successfully
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
 *                   example: "Villages in district 1001 retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Village'
 *       500:
 *         description: Server error
 */
