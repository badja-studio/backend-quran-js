const { Participant, Assessor, Assessment, User } = require('../models');
const { Op } = require('sequelize');

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
      'kab_kota': 'kab_kota',
      'tahun_lulus': 'tahun_lulus'
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
        { kab_kota: { [Op.iLike]: `%${search}%` } }
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

  async findNotAssessed(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'DESC'
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

    const whereClause = {
      ...searchWhere,
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
      sortOrder = 'DESC'
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

    const whereClause = {
      ...searchWhere,
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

  async create(participantData) {
    return await Participant.create(participantData);
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
}

module.exports = new ParticipantRepository();
