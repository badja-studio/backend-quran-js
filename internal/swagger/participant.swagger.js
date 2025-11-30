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
 *           type: integer
 *           description: Unique identifier for the participant
 *         no_akun:
 *           type: string
 *           description: Account number of the participant
 *         nip:
 *           type: string
 *           description: NIP (Employee ID) of the participant
 *         nik:
 *           type: string
 *           description: NIK (National ID) of the participant
 *         nama:
 *           type: string
 *           description: Name of the participant
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
 *         jabatan:
 *           type: string
 *           description: Position/Job title
 *         jenjang:
 *           type: string
 *           description: Education level
 *         level:
 *           type: string
 *           description: Skill level
 *         provinsi:
 *           type: string
 *           description: Province
 *         kab_kota:
 *           type: string
 *           description: City/Regency
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
 *         asal_kampus:
 *           type: string
 *           description: Campus origin
 *         fakultas:
 *           type: string
 *           description: Faculty
 *         tingkat_sekolah:
 *           type: string
 *           enum: [MI, MTs, MA]
 *           description: School level (MI/MTs/MA)
 *         nama_sekolah:
 *           type: string
 *           description: School name
 *         alamat_sekolah:
 *           type: string
 *           description: School address
 *         kecamatan:
 *           type: string
 *           description: District
 *         desa_kelurahan:
 *           type: string
 *           description: Village/Sub-district
 *         status_pegawai:
 *           type: string
 *           enum: [PNS, PPPK, NON_PNS]
 *           description: Employee status (PNS/PPPK/NON_PNS)
 *         sertifikasi:
 *           type: string
 *           enum: [SUDAH, BELUM]
 *           description: Certification status (SUDAH/BELUM)
 *         tahun_sertifikasi:
 *           type: integer
 *           description: Certification year
 *         usia:
 *           type: integer
 *           description: Age
 *         pegawai:
 *           type: string
 *           description: Employee type
 *         jadwal:
 *           type: string
 *           format: date-time
 *           description: Schedule
 *         asesor_id:
 *           type: integer
 *           description: Assigned assessor ID
 *         status:
 *           type: string
 *           enum: [SUDAH, BELUM]
 *           description: Assessment status
 *         akun_id:
 *           type: integer
 *           description: User account ID
 *         assessor:
 *           $ref: '#/components/schemas/AssessorBasic'
 *         user:
 *           $ref: '#/components/schemas/UserBasic'
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
 *           description: NIP (Employee ID) - will be used as username and password for login
 *         nama:
 *           type: string
 *           description: Name of the participant
 *         jenis_kelamin:
 *           type: string
 *           enum: [L, P]
 *           description: Gender (L for Male, P for Female)
 *         tempat_lahir:
 *           type: string
 *           description: Place of birth
 *         jabatan:
 *           type: string
 *           description: Position/Job title
 *         jenjang:
 *           type: string
 *           description: Education level
 *         level:
 *           type: string
 *           description: Skill level
 *         provinsi:
 *           type: string
 *           description: Province
 *         kab_kota:
 *           type: string
 *           description: City/Regency
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
 *           format: date-time
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
 *           description: NIK (National ID) of the participant
 *         nama:
 *           type: string
 *           description: Name of the participant
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
 *         jabatan:
 *           type: string
 *           description: Position/Job title
 *         jenjang:
 *           type: string
 *           description: Education level
 *         level:
 *           type: string
 *           description: Skill level
 *         provinsi:
 *           type: string
 *           description: Province
 *         kab_kota:
 *           type: string
 *           description: City/Regency
 *         kecamatan:
 *           type: string
 *           description: District
 *         desa_kelurahan:
 *           type: string
 *           description: Village/Sub-district
 *         sekolah:
 *           type: string
 *           description: School name
 *         nama_sekolah:
 *           type: string
 *           description: School name (detailed)
 *         alamat_sekolah:
 *           type: string
 *           description: School address
 *         tingkat_sekolah:
 *           type: string
 *           enum: [MI, MTs, MA]
 *           description: School level (MI/MTs/MA)
 *         pendidikan:
 *           type: string
 *           description: Educational background
 *         prodi:
 *           type: string
 *           description: Study program
 *         perguruan_tinggi:
 *           type: string
 *           description: University name
 *         asal_kampus:
 *           type: string
 *           description: Campus origin
 *         fakultas:
 *           type: string
 *           description: Faculty
 *         jenis_pt:
 *           type: string
 *           description: University type
 *         tahun_lulus:
 *           type: integer
 *           description: Graduation year
 *         status_pegawai:
 *           type: string
 *           enum: [PNS, PPPK, NON_PNS]
 *           description: Employee status (PNS/PPPK/NON_PNS)
 *         sertifikasi:
 *           type: string
 *           enum: [SUDAH, BELUM]
 *           description: Certification status (SUDAH/BELUM)
 *         tahun_sertifikasi:
 *           type: integer
 *           description: Certification year
 *         usia:
 *           type: integer
 *           description: Age
 *         pegawai:
 *           type: string
 *           description: Employee type
 *         password:
 *           type: string
 *           format: password
 *           description: Password for login account
 *     
 *     PaginatedParticipants:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Participant'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 */

/**
 * @swagger
 * /api/participants:
 *   get:
 *     summary: Get all participants with pagination, filtering, and search
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
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name, NIP, account number, etc.
 *       - in: query
 *         name: filters
 *         schema:
 *           type: string
 *           example: '[{"field":"jenis_kelamin","op":"eq","value":"P"},{"field":"nama","op":"ilike","value":"Ahmad"}]'
 *         description: |
 *           Advanced filters as JSON string array of objects with field, op (operator), and value.
 *           Supported operators: eq (equals), ne (not equals), gt (greater than), gte (greater than or equal), 
 *           lt (less than), lte (less than or equal), like (pattern matching), ilike (case insensitive pattern), 
 *           in (value in array), notin (value not in array), between (value between range), 
 *           notbetween (value not between range), isnull (is null), isnotnull (is not null).
 *           Example: filters=[{"field":"status","op":"eq","value":"BELUM"},{"field":"jenis_kelamin","op":"in","value":["L","P"]}]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, nama, nip, no_akun, status, jenis_kelamin, tempat_lahir, tanggal_lahir, agama, pangkat, golongan, jabatan, unit_kerja]
 *           default: createdAt
 *         description: Field to sort by (supports all participant fields)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order (ASC for ascending, DESC for descending)
 *       - in: query
 *         name: jenis_kelamin
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [L, P]
 *         style: form
 *         explode: true
 *         description: Filter by gender (supports array - use jenis_kelamin[]=L&jenis_kelamin[]=P)
 *       - in: query
 *         name: provinsi
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: Filter by province (supports multiple values)
 *       - in: query
 *         name: status
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [SUDAH, BELUM]
 *         style: form
 *         explode: true
 *         description: Filter by assessment status (supports multiple values)
 *       - in: query
 *         name: level
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: Filter by skill level (supports multiple values)
 *       - in: query
 *         name: jenjang
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: Filter by education level (supports multiple values)
 *       - in: query
 *         name: tahun_lulus
 *         schema:
 *           type: object
 *           properties:
 *             min:
 *               type: integer
 *             max:
 *               type: integer
 *         description: Filter by graduation year range (use tahun_lulus[min]=2000&tahun_lulus[max]=2020)
 *     responses:
 *       200:
 *         description: Participants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedParticipants'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new participant
 *     description: Creates a new participant and automatically generates a user account. The NIP will be used as both username and password for login.
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
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/participants/profile:
 *   get:
 *     summary: Get current user's participant profile
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Participant'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Participant not found
 */

/**
 * @swagger
 * /api/participants/not-assessed:
 *   get:
 *     summary: Get participants that have not been assessed yet
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Not assessed participants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedParticipants'
 */

/**
 * @swagger
 * /api/participants/ready-to-assess:
 *   get:
 *     summary: Get participants that are ready to be assessed (assigned to assessor but not assessed)
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ready to assess participants retrieved successfully
 */

/**
 * @swagger
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
 *           type: integer
 *         description: Participant ID
 *     responses:
 *       200:
 *         description: Participant retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Participant not found
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
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParticipantCreate'
 *     responses:
 *       200:
 *         description: Participant updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Participant not found
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
 *           type: integer
 *     responses:
 *       200:
 *         description: Participant deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Participant not found
 */

/**
 * @swagger
 * /api/participants/{id}/assign-assessor:
 *   put:
 *     summary: Assign assessor to participant
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - asesor_id
 *             properties:
 *               asesor_id:
 *                 type: integer
 *                 description: Assessor ID to assign
 *     responses:
 *       200:
 *         description: Assessor assigned successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Participant or assessor not found
 */

/**
 * @swagger
 * /api/participants/{id}/status:
 *   put:
 *     summary: Update participant status
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [SUDAH, BELUM]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Participant not found
 */

/**
 * @swagger
 * /api/participants/statistics:
 *   get:
 *     summary: Get participant statistics
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     SUDAH:
 *                       type: integer
 *                     BELUM:
 *                       type: integer

/**
 * @swagger
 * /api/participants/register:
 *   post:
 *     summary: Register a new participant (No authentication required)
 *     tags: [Participants]
 *     description: Register a new participant with all required information including password for login account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ParticipantRegister'
 *           example:
 *             no_akun: "PA001"
 *             nip: "123456789"
 *             nik: "1234567890123456"
 *             nama: "John Doe"
 *             jenis_kelamin: "L"
 *             tempat_lahir: "Jakarta"
 *             tanggal_lahir: "1990-01-01"
 *             jabatan: "Guru"
 *             pendidikan: "S1"
 *             prodi: "Pendidikan Islam"
 *             perguruan_tinggi: "UIN Jakarta"
 *             asal_kampus: "Jakarta"
 *             fakultas: "Fakultas Tarbiyah"
 *             tahun_lulus: 2015
 *             tingkat_sekolah: "MA"
 *             nama_sekolah: "MA Al-Hikmah"
 *             alamat_sekolah: "Jl. Pendidikan No. 123"
 *             provinsi: "DKI Jakarta"
 *             kab_kota: "Jakarta Pusat"
 *             kecamatan: "Menteng"
 *             desa_kelurahan: "Gondangdia"
 *             status_pegawai: "PNS"
 *             sertifikasi: "SUDAH"
 *             tahun_sertifikasi: 2018
 *             password: "securepassword123"
 *     responses:
 *       201:
 *         description: Participant registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Participant registered successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Participant'
 *       400:
 *         description: Bad request - validation error or participant already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Participant with this NIP already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to register participant"
 */
