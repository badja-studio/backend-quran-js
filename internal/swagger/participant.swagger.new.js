/**
 * @swagger
 * components:
 *   schemas:
 *     Participant:
 *       type: object
 *       required:
 *         - no_akun
 *         - nip
 *         - nama
 *         - jenis_kelamin
 *         - akun_id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the participant
 *         no_akun:
 *           type: string
 *           description: Account number of the participant
 *         nip:
 *           type: string
 *           description: NIP (Employee ID) of the participant
 *         nik:
 *           type: string
 *           maxLength: 16
 *           description: NIK (National ID) of the participant
 *         nama:
 *           type: string
 *           description: Full name of the participant
 *         jenis_kelamin:
 *           type: string
 *           enum: [L, P]
 *           description: Gender (L for Male, P for Female)
 *         tempat_lahir:
 *           type: string
 *           description: Place of birth
 *         tanggal_lahir:
 *           type: string
 *           format: date
 *           description: Date of birth
 *         tingkat_pendidikan:
 *           type: string
 *           enum: [SD, SMP, SMA, DIPLOMA, SARJANA, MAGISTER, DOKTOR]
 *           description: Education level
 *         alamat_lengkap:
 *           type: string
 *           description: Complete address
 *         provinsi:
 *           type: string
 *           description: Province name
 *         kota:
 *           type: string
 *           description: City/Regency name
 *         kecamatan:
 *           type: string
 *           description: District name
 *         kelurahan:
 *           type: string
 *           description: Village/Sub-district name
 *         kode_pos:
 *           type: string
 *           maxLength: 10
 *           description: Postal code
 *         status_pegawai:
 *           type: string
 *           enum: [PNS, PPPK, HONORER, KONTRAK]
 *           description: Employee status
 *         usia_pegawai:
 *           type: integer
 *           description: Age as employee (years of service)
 *         sertifikat_profesi:
 *           type: string
 *           description: Professional certificate held
 *         jabatan:
 *           type: string
 *           description: Position/Job title
 *         jenjang:
 *           type: string
 *           description: Education level
 *         level:
 *           type: string
 *           description: Skill level
 *         sekolah:
 *           type: string
 *           description: School name
 *         pendidikan:
 *           type: string
 *           description: Educational background
 *         prodi:
 *           type: string
 *           description: Study program
 *         perguruan_tinggi:
 *           type: string
 *           description: University name
 *         jenis_pt:
 *           type: string
 *           description: University type
 *         tahun_lulus:
 *           type: integer
 *           description: Graduation year
 *         jadwal:
 *           type: string
 *           description: Schedule
 *         asesor_id:
 *           type: string
 *           format: uuid
 *           description: Assigned assessor ID
 *         status:
 *           type: string
 *           enum: [BELUM, PROSES, SELESAI]
 *           description: Assessment status
 *         akun_id:
 *           type: string
 *           format: uuid
 *           description: User account ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     
 *     ParticipantCreate:
 *       type: object
 *       required:
 *         - no_akun
 *         - nip
 *         - nama
 *         - jenis_kelamin
 *       properties:
 *         no_akun:
 *           type: string
 *           description: Account number of the participant
 *         nip:
 *           type: string
 *           description: NIP (Employee ID) of the participant
 *         nik:
 *           type: string
 *           maxLength: 16
 *           description: NIK (National ID) of the participant
 *         nama:
 *           type: string
 *           description: Full name of the participant
 *         jenis_kelamin:
 *           type: string
 *           enum: [L, P]
 *           description: Gender (L for Male, P for Female)
 *         tempat_lahir:
 *           type: string
 *           description: Place of birth
 *         tanggal_lahir:
 *           type: string
 *           format: date
 *           description: Date of birth (YYYY-MM-DD)
 *         tingkat_pendidikan:
 *           type: string
 *           enum: [SD, SMP, SMA, DIPLOMA, SARJANA, MAGISTER, DOKTOR]
 *           description: Education level
 *         alamat_lengkap:
 *           type: string
 *           description: Complete address
 *         provinsi:
 *           type: string
 *           description: Province name
 *         kota:
 *           type: string
 *           description: City/Regency name
 *         kecamatan:
 *           type: string
 *           description: District name
 *         kelurahan:
 *           type: string
 *           description: Village/Sub-district name
 *         kode_pos:
 *           type: string
 *           maxLength: 10
 *           description: Postal code
 *         status_pegawai:
 *           type: string
 *           enum: [PNS, PPPK, HONORER, KONTRAK]
 *           description: Employee status
 *         usia_pegawai:
 *           type: integer
 *           description: Age as employee (years of service)
 *         sertifikat_profesi:
 *           type: string
 *           description: Professional certificate held
 *         jabatan:
 *           type: string
 *           description: Position/Job title
 *         jenjang:
 *           type: string
 *           description: Education level
 *         level:
 *           type: string
 *           description: Skill level
 *         sekolah:
 *           type: string
 *           description: School name
 *         pendidikan:
 *           type: string
 *           description: Educational background
 *         prodi:
 *           type: string
 *           description: Study program
 *         perguruan_tinggi:
 *           type: string
 *           description: University name
 *         jenis_pt:
 *           type: string
 *           description: University type
 *         tahun_lulus:
 *           type: integer
 *           description: Graduation year
 *         jadwal:
 *           type: string
 *           description: Schedule
 *     
 *     ParticipantRegister:
 *       type: object
 *       required:
 *         - no_akun
 *         - nip
 *         - nama
 *         - jenis_kelamin
 *         - password
 *       properties:
 *         no_akun:
 *           type: string
 *           description: Account number of the participant
 *         nip:
 *           type: string
 *           description: NIP (Employee ID) - will be used as username
 *         nik:
 *           type: string
 *           maxLength: 16
 *           description: NIK (National ID) of the participant
 *         nama:
 *           type: string
 *           description: Full name of the participant
 *         jenis_kelamin:
 *           type: string
 *           enum: [L, P]
 *           description: Gender (L for Male, P for Female)
 *         tempat_lahir:
 *           type: string
 *           description: Place of birth
 *         tanggal_lahir:
 *           type: string
 *           format: date
 *           description: Date of birth (YYYY-MM-DD)
 *         tingkat_pendidikan:
 *           type: string
 *           enum: [SD, SMP, SMA, DIPLOMA, SARJANA, MAGISTER, DOKTOR]
 *           description: Education level
 *         alamat_lengkap:
 *           type: string
 *           description: Complete address
 *         provinsi:
 *           type: string
 *           description: Province name
 *         kota:
 *           type: string
 *           description: City/Regency name
 *         kecamatan:
 *           type: string
 *           description: District name
 *         kelurahan:
 *           type: string
 *           description: Village/Sub-district name
 *         kode_pos:
 *           type: string
 *           maxLength: 10
 *           description: Postal code
 *         status_pegawai:
 *           type: string
 *           enum: [PNS, PPPK, HONORER, KONTRAK]
 *           description: Employee status
 *         usia_pegawai:
 *           type: integer
 *           description: Age as employee (years of service)
 *         sertifikat_profesi:
 *           type: string
 *           description: Professional certificate held
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Password for user account
 *
 *     ParticipantUpdate:
 *       type: object
 *       properties:
 *         no_akun:
 *           type: string
 *           description: Account number of the participant
 *         nip:
 *           type: string
 *           description: NIP (Employee ID) of the participant
 *         nik:
 *           type: string
 *           maxLength: 16
 *           description: NIK (National ID) of the participant
 *         nama:
 *           type: string
 *           description: Full name of the participant
 *         jenis_kelamin:
 *           type: string
 *           enum: [L, P]
 *           description: Gender (L for Male, P for Female)
 *         tempat_lahir:
 *           type: string
 *           description: Place of birth
 *         tanggal_lahir:
 *           type: string
 *           format: date
 *           description: Date of birth (YYYY-MM-DD)
 *         tingkat_pendidikan:
 *           type: string
 *           enum: [SD, SMP, SMA, DIPLOMA, SARJANA, MAGISTER, DOKTOR]
 *           description: Education level
 *         alamat_lengkap:
 *           type: string
 *           description: Complete address
 *         provinsi:
 *           type: string
 *           description: Province name
 *         kota:
 *           type: string
 *           description: City/Regency name
 *         kecamatan:
 *           type: string
 *           description: District name
 *         kelurahan:
 *           type: string
 *           description: Village/Sub-district name
 *         kode_pos:
 *           type: string
 *           maxLength: 10
 *           description: Postal code
 *         status_pegawai:
 *           type: string
 *           enum: [PNS, PPPK, HONORER, KONTRAK]
 *           description: Employee status
 *         usia_pegawai:
 *           type: integer
 *           description: Age as employee (years of service)
 *         sertifikat_profesi:
 *           type: string
 *           description: Professional certificate held
 *         jabatan:
 *           type: string
 *           description: Position/Job title
 *         jenjang:
 *           type: string
 *           description: Education level
 *         level:
 *           type: string
 *           description: Skill level
 *         sekolah:
 *           type: string
 *           description: School name
 *         pendidikan:
 *           type: string
 *           description: Educational background
 *         prodi:
 *           type: string
 *           description: Study program
 *         perguruan_tinggi:
 *           type: string
 *           description: University name
 *         jenis_pt:
 *           type: string
 *           description: University type
 *         tahun_lulus:
 *           type: integer
 *           description: Graduation year
 *         jadwal:
 *           type: string
 *           description: Schedule
 *         asesor_id:
 *           type: string
 *           format: uuid
 *           description: Assigned assessor ID
 *         status:
 *           type: string
 *           enum: [BELUM, PROSES, SELESAI]
 *           description: Assessment status
 *
 *     ParticipantResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Response status
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           $ref: '#/components/schemas/Participant'
 *
 *     ParticipantsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Response status
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Participant'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               description: Current page
 *             limit:
 *               type: integer
 *               description: Items per page
 *             total:
 *               type: integer
 *               description: Total items
 *             totalPages:
 *               type: integer
 *               description: Total pages
 */

/**
 * @swagger
 * /api/participants:
 *   get:
 *     summary: Get all participants with pagination, search, and filtering
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name, nip, or email
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order
 *       - in: query
 *         name: filters
 *         schema:
 *           type: string
 *         description: JSON string of filters array
 *     responses:
 *       200:
 *         description: List of participants
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ParticipantsResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new participant
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParticipantCreate'
 *     responses:
 *       201:
 *         description: Participant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ParticipantResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 * /api/participants/register:
 *   post:
 *     summary: Register a new participant with user account
 *     tags: [Participants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParticipantRegister'
 *     responses:
 *       201:
 *         description: Participant registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ParticipantResponse'
 *       400:
 *         description: Bad request - validation error or participant already exists
 *       500:
 *         description: Internal server error
 *
 * /api/participants/{id}:
 *   get:
 *     summary: Get participant by ID
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Participant ID
 *     responses:
 *       200:
 *         description: Participant details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ParticipantResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Participant not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update participant
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Participant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParticipantUpdate'
 *     responses:
 *       200:
 *         description: Participant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ParticipantResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Participant not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete participant
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Participant ID
 *     responses:
 *       200:
 *         description: Participant deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Participant not found
 *       500:
 *         description: Internal server error
 */

module.exports = {};
