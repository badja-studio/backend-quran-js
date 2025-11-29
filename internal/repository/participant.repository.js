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
      filters = {}
    } = options;

    // Mapping untuk field sorting yang valid
    const validSortFields = {
      'createdAt': 'createdAt',
      'updatedAt': 'updatedAt',
      'nama': 'nama',
      'nip': 'nip',
      'no_akun': 'no_akun',
      'status': 'status'
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

    // Build where clause for filters
    const filterWhere = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        filterWhere[key] = filters[key];
      }
    });

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
      order: [["createdAt", sortOrder.toUpperCase()]],
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
      order: [["createdAt", sortOrder.toUpperCase()]],
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
      order: [["createdAt", sortOrder.toUpperCase()]],
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
