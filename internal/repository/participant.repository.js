const { Participant, Assessor, Assessment, User } = require('../models');
const { Op } = require('sequelize');
const { calculateParticipantScores, formatScoresForAPI } = require('../utils/scoring.utils');

class ParticipantRepository {
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      filters = []
    } = options;

    // Mapping untuk field sorting yang valid
    const validSortFields = {
      'createdAt': 'createdAt',
      'updatedAt': 'updatedAt',
      'nama': 'nama',
      'nip': 'nip',
      'no_akun': 'no_akun',
      'status': 'status',
      'jenis_kelamin': 'jenis_kelamin',
      'jabatan': 'jabatan',
      'jenjang': 'jenjang',
      'level': 'level',
      'provinsi': 'provinsi',
      'tahun_lulus': 'tahun_lulus',
      'kota': 'kota'
    };

    const orderField = validSortFields[sortBy] || 'createdAt';
    const offset = (page - 1) * limit;

    // Build where clause for search
    const searchWhere = search ? {
      [Op.or]: [
        { nama: { [Op.iLike]: `%${search}%` } },
        { nip: { [Op.iLike]: `%${search}%` } },
        { no_akun: { [Op.iLike]: `%${search}%` } },
        { jabatan: { [Op.iLike]: `%${search}%` } },
        { sekolah: { [Op.iLike]: `%${search}%` } },
        { provinsi: { [Op.iLike]: `%${search}%` } },
        { kota: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    // Build advanced filters - support array of objects with field, op, value
    const filterWhere = {};
    
    if (Array.isArray(filters) && filters.length > 0) {
      // Process each filter condition
      filters.forEach(filter => {
        const { field, op, value } = filter;
        
        if (!field || !op || value === undefined || value === null || value === '') {
          return; // Skip invalid filters
        }

        // Map operators to Sequelize operators
        let sequelizeOp;
        switch(op.toLowerCase()) {
          case 'eq': // equals
          case '=':
            sequelizeOp = Op.eq;
            break;
          case 'ne': // not equals
          case '!=':
            sequelizeOp = Op.ne;
            break;
          case 'gt': // greater than
          case '>':
            sequelizeOp = Op.gt;
            break;
          case 'gte': // greater than or equal
          case '>=':
            sequelizeOp = Op.gte;
            break;
          case 'lt': // less than
          case '<':
            sequelizeOp = Op.lt;
            break;
          case 'lte': // less than or equal
          case '<=':
            sequelizeOp = Op.lte;
            break;
          case 'like': // case sensitive pattern matching
            sequelizeOp = Op.like;
            break;
          case 'ilike': // case insensitive pattern matching
            sequelizeOp = Op.iLike;
            break;
          case 'in': // value in array
            sequelizeOp = Op.in;
            break;
          case 'notin': // value not in array
          case 'not_in':
            sequelizeOp = Op.notIn;
            break;
          case 'between': // value between two values
            sequelizeOp = Op.between;
            break;
          case 'notbetween': // value not between two values
          case 'not_between':
            sequelizeOp = Op.notBetween;
            break;
          case 'isnull': // is null
          case 'is_null':
            filterWhere[field] = { [Op.is]: null };
            return;
          case 'isnotnull': // is not null
          case 'is_not_null':
            filterWhere[field] = { [Op.not]: null };
            return;
          default:
            return; // Skip unknown operators
        }

        // Handle special cases for like operations
        let finalValue = value;
        if ((op.toLowerCase() === 'like' || op.toLowerCase() === 'ilike') && 
            typeof value === 'string' && 
            !value.includes('%')) {
          finalValue = `%${value}%`; // Add wildcards if not present
        }

        // Apply filter condition
        if (filterWhere[field]) {
          // If field already has conditions, combine with AND
          filterWhere[field] = {
            [Op.and]: [
              filterWhere[field],
              { [sequelizeOp]: finalValue }
            ]
          };
        } else {
          filterWhere[field] = { [sequelizeOp]: finalValue };
        }
      });
    }

    const whereClause = {
      ...searchWhere,
      ...filterWhere
    };

    const { count, rows } = await Participant.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Assessor,
          as: 'assessor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'akun',
          attributes: ['id', 'username']
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [[orderField, sortOrder.toUpperCase()]],
      distinct: true
    });

    return {
      data: rows,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: count,
        total_pages: Math.ceil(count / limit)
      }
    };
  }

  async findById(id) {
    return await Participant.findByPk(id, {
      include: [
        {
          model: Assessor,
          as: 'assessor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'akun',
          attributes: ['id', 'username']
        }
      ]
    });
  }

  async findByUserId(userId) {
    return await Participant.findOne({
      where: { akun_id: userId },
      include: [
        {
          model: Assessor,
          as: 'assessor',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
  }

  async findByNip(nip) {
    return await Participant.findOne({
      where: { nip: nip },
      include: [
        {
          model: User,
          as: 'akun',
          attributes: ['id', 'username', 'role']
        }
      ]
    });
  }

  async findNotAssessed(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      filters = []
    } = options;

    const offset = (page - 1) * limit;

    // Map sortBy to actual field names
    const sortFieldMapping = {
      'createdAt': 'createdAt',
      'updatedAt': 'updatedAt',
      'nama': 'nama',
      'nip': 'nip',
      'no_akun': 'no_akun',
      'status': 'status',
      'jenis_kelamin': 'jenis_kelamin',
      'tempat_lahir': 'tempat_lahir',
      'tanggal_lahir': 'tanggal_lahir',
      'agama': 'agama',
      'pangkat': 'pangkat',
      'golongan': 'golongan',
      'jabatan': 'jabatan',
      'unit_kerja': 'unit_kerja'
    };

    const orderField = sortFieldMapping[sortBy] || 'createdAt';

    const searchWhere = search ? {
      [Op.or]: [
        { nama: { [Op.iLike]: `%${search}%` } },
        { nip: { [Op.iLike]: `%${search}%` } },
        { no_akun: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    // Build advanced filters
    const filterWhere = {};
    if (Array.isArray(filters) && filters.length > 0) {
      filters.forEach(filter => {
        const { field, op, value } = filter;
        
        if (!field || !op || value === undefined || value === null || value === '') {
          return;
        }

        let sequelizeOp;
        switch(op.toLowerCase()) {
          case 'eq': case '=': sequelizeOp = Op.eq; break;
          case 'ne': case '!=': sequelizeOp = Op.ne; break;
          case 'gt': case '>': sequelizeOp = Op.gt; break;
          case 'gte': case '>=': sequelizeOp = Op.gte; break;
          case 'lt': case '<': sequelizeOp = Op.lt; break;
          case 'lte': case '<=': sequelizeOp = Op.lte; break;
          case 'like': sequelizeOp = Op.like; break;
          case 'ilike': sequelizeOp = Op.iLike; break;
          case 'in': sequelizeOp = Op.in; break;
          case 'notin': case 'not_in': sequelizeOp = Op.notIn; break;
          case 'between': sequelizeOp = Op.between; break;
          case 'notbetween': case 'not_between': sequelizeOp = Op.notBetween; break;
          case 'isnull': case 'is_null':
            filterWhere[field] = { [Op.is]: null };
            return;
          case 'isnotnull': case 'is_not_null':
            filterWhere[field] = { [Op.not]: null };
            return;
          default: return;
        }

        let finalValue = value;
        if ((op.toLowerCase() === 'like' || op.toLowerCase() === 'ilike') && 
            typeof value === 'string' && 
            !value.includes('%')) {
          finalValue = `%${value}%`;
        }

        if (filterWhere[field]) {
          filterWhere[field] = {
            [Op.and]: [
              filterWhere[field],
              { [sequelizeOp]: finalValue }
            ]
          };
        } else {
          filterWhere[field] = { [sequelizeOp]: finalValue };
        }
      });
    }

    const whereClause = {
      ...searchWhere,
      ...filterWhere,
      status: 'BELUM'
    };

    const { count, rows } = await Participant.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Assessor,
          as: 'assessor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'akun',
          attributes: ['id', 'username']
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [[orderField, sortOrder.toUpperCase()]],
      distinct: true
    });

    return {
      data: rows,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: count,
        total_pages: Math.ceil(count / limit)
      }
    };
  }

  async findReadyToAssess(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      filters = []
    } = options;

    const offset = (page - 1) * limit;

    // Map sortBy to actual field names
    const sortFieldMapping = {
      'createdAt': 'createdAt',
      'updatedAt': 'updatedAt',
      'nama': 'nama',
      'nip': 'nip',
      'no_akun': 'no_akun',
      'status': 'status',
      'jenis_kelamin': 'jenis_kelamin',
      'tempat_lahir': 'tempat_lahir',
      'tanggal_lahir': 'tanggal_lahir',
      'agama': 'agama',
      'pangkat': 'pangkat',
      'golongan': 'golongan',
      'jabatan': 'jabatan',
      'unit_kerja': 'unit_kerja'
    };

    const orderField = sortFieldMapping[sortBy] || 'createdAt';

    const searchWhere = search ? {
      [Op.or]: [
        { nama: { [Op.iLike]: `%${search}%` } },
        { nip: { [Op.iLike]: `%${search}%` } },
        { no_akun: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    // Build advanced filters
    const filterConditions = {};
    if (filters && Array.isArray(filters) && filters.length > 0) {
      const operatorMap = {
        'eq': Op.eq,
        'ne': Op.ne,
        'gt': Op.gt,
        'gte': Op.gte,
        'lt': Op.lt,
        'lte': Op.lte,
        'like': Op.like,
        'ilike': Op.iLike,
        'in': Op.in,
        'notin': Op.notIn,
        'between': Op.between,
        'notbetween': Op.notBetween,
        'isnull': Op.is,
        'isnotnull': Op.not
      };

      const allowedFields = [
        'id', 'nama', 'nip', 'no_akun', 'status', 'jenis_kelamin', 'tempat_lahir', 
        'tanggal_lahir', 'agama', 'pangkat', 'golongan', 'jabatan', 'unit_kerja',
        'createdAt', 'updatedAt', 'asesor_id'
      ];

      filters.forEach(filter => {
        if (filter.field && filter.op && allowedFields.includes(filter.field)) {
          const operator = operatorMap[filter.op];
          if (operator) {
            let value = filter.value;
            
            // Handle special cases
            if (filter.op === 'isnull') {
              value = null;
            } else if (filter.op === 'isnotnull') {
              value = null;
            } else if (filter.op === 'in' || filter.op === 'notin') {
              value = Array.isArray(value) ? value : [value];
            } else if (filter.op === 'between' || filter.op === 'notbetween') {
              value = Array.isArray(value) ? value : [value, value];
            }

            filterConditions[filter.field] = { [operator]: value };
          }
        }
      });
    }

    const whereClause = {
      ...searchWhere,
      ...filterConditions,
      asesor_id: { [Op.not]: null },
      status: 'BELUM'
    };

    const { count, rows } = await Participant.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Assessor,
          as: 'assessor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'akun',
          attributes: ['id', 'username']
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [[orderField, sortOrder.toUpperCase()]],
      distinct: true
    });

    return {
      data: rows,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: count,
        total_pages: Math.ceil(count / limit)
      }
    };
  }

  async findParticipantAssessments(participantId) {
    return await Participant.findByPk(participantId, {
      include: [
        {
          model: Assessor,
          as: 'assessor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Assessment,
          as: 'assessments',
          include: [
            {
              model: Assessor,
              as: 'assessor',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });
  }

  async create(participantData, options = {}) {
    return await Participant.create(participantData, options);
  }

  async update(id, participantData) {
    const [updatedRowsCount] = await Participant.update(participantData, {
      where: { id }
    });
    
    if (updatedRowsCount === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    return await Participant.destroy({
      where: { id }
    });
  }

  async assignAssessor(participantId, assessorId) {
    return await this.update(participantId, { asesor_id: assessorId });
  }

  async updateStatus(participantId, status) {
    return await this.update(participantId, { status });
  }

  async countByStatus() {
    const results = await Participant.findAll({
      attributes: [
        'status',
        [Participant.sequelize.fn('COUNT', Participant.sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const statusCounts = {
      SUDAH: 0,
      BELUM: 0
    };

    results.forEach(result => {
      statusCounts[result.status] = parseInt(result.dataValues.count);
    });

    return statusCounts;
  }

  /**
   * Get participant assessments and calculate scores
   * @param {string} participantId - Participant ID
   * @returns {Object} - Calculated scores with category breakdown
   */
  async getParticipantScores(participantId) {
    try {
      const assessments = await Assessment.findAll({
        where: { peserta_id: participantId },
        raw: true
      });

      if (!assessments || assessments.length === 0) {
        // Return default scores if no assessments found
        return formatScoresForAPI({
          categoryScores: {},
          overallAverage: 100,
          totalDeduction: 0,
          assessmentCount: 0,
          calculatedAt: new Date().toISOString()
        });
      }

      const scoreData = calculateParticipantScores(assessments);
      return formatScoresForAPI(scoreData);
    } catch (error) {
      console.error('Error calculating participant scores:', error);
      throw new Error(`Failed to calculate scores: ${error.message}`);
    }
  }

  /**
   * Get scores for multiple participants
   * @param {Array} participantIds - Array of participant IDs
   * @returns {Object} - Object with participant IDs as keys and scores as values
   */
  async getMultipleParticipantScores(participantIds) {
    try {
      const assessments = await Assessment.findAll({
        where: { peserta_id: { [Op.in]: participantIds } },
        raw: true
      });

      const scoresByParticipant = {};

      // Group assessments by participant
      const assessmentsByParticipant = assessments.reduce((acc, assessment) => {
        if (!acc[assessment.peserta_id]) {
          acc[assessment.peserta_id] = [];
        }
        acc[assessment.peserta_id].push(assessment);
        return acc;
      }, {});

      // Calculate scores for each participant
      participantIds.forEach(participantId => {
        const participantAssessments = assessmentsByParticipant[participantId] || [];
        
        if (participantAssessments.length === 0) {
          // Default scores if no assessments
          scoresByParticipant[participantId] = formatScoresForAPI({
            categoryScores: {},
            overallAverage: 100,
            totalDeduction: 0,
            assessmentCount: 0,
            calculatedAt: new Date().toISOString()
          });
        } else {
          const scoreData = calculateParticipantScores(participantAssessments);
          scoresByParticipant[participantId] = formatScoresForAPI(scoreData);
        }
      });

      return scoresByParticipant;
    } catch (error) {
      console.error('Error calculating multiple participant scores:', error);
      throw new Error(`Failed to calculate multiple scores: ${error.message}`);
    }
  }

  /**
   * Enhanced findAll that includes calculated scores
   * @param {Object} options - Query options
   * @param {boolean} includeScores - Whether to include calculated scores
   * @returns {Object} - Participants with scores if requested
   */
  async findAllWithScores(options = {}) {
    // Get participants using existing findAll method
    const result = await this.findAll(options);
    
    if (!result.data || result.data.length === 0) {
      return result;
    }

    // Get participant IDs
    const participantIds = result.data.map(participant => participant.id);

    // Calculate scores for all participants
    const scoresByParticipant = await this.getMultipleParticipantScores(participantIds);

    // Add scores to participant data
    result.data = result.data.map(participant => ({
      ...participant.toJSON(),
      scoring: scoresByParticipant[participant.id] || null
    }));

    return result;
  }

  /**
   * Enhanced findById that includes calculated scores
   * @param {string} id - Participant ID
   * @param {boolean} includeScores - Whether to include calculated scores
   * @returns {Object} - Participant with scores if requested
   */
  async findByIdWithScores(id) {
    const participant = await this.findById(id);
    
    if (!participant) {
      return null;
    }

    // Calculate scores for this participant
    const scores = await this.getParticipantScores(id);

    return {
      ...participant.toJSON(),
      scoring: scores
    };
  }
}

module.exports = new ParticipantRepository();
