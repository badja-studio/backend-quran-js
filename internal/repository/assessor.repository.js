const { Assessor, User, Participant } = require('../models');
const { Op } = require('sequelize');

class AssessorRepository {
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'created_at',
      sortOrder = 'DESC',
      filters = {}
    } = options;

    const offset = (page - 1) * limit;

    // Build where clause for search
    const searchWhere = search ? {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { no_telepon: { [Op.iLike]: `%${search}%` } }
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

    const { count, rows } = await Assessor.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        },
        {
          model: Participant,
          as: 'participants',
          attributes: ['id', 'nama', 'status']
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
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
    return await Assessor.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        },
        {
          model: Participant,
          as: 'participants',
          attributes: ['id', 'nama', 'status']
        }
      ]
    });
  }

  async findByUserId(userId) {
    return await Assessor.findOne({
      where: { akun_id: userId },
      include: [
        {
          model: Participant,
          as: 'participants',
          attributes: ['id', 'nama', 'status']
        }
      ]
    });
  }

  async findWithParticipants(assessorId, options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'created_at',
      sortOrder = 'DESC',
      status = null
    } = options;

    const offset = (page - 1) * limit;

    // Build participant search where clause
    const participantSearchWhere = search ? {
      [Op.or]: [
        { nama: { [Op.iLike]: `%${search}%` } },
        { nip: { [Op.iLike]: `%${search}%` } },
        { no_akun: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    // Add status filter if provided
    const participantWhere = {
      ...participantSearchWhere,
      asesor_id: assessorId
    };

    if (status) {
      participantWhere.status = status;
    }

    const { count, rows } = await Participant.findAndCountAll({
      where: participantWhere,
      include: [
        {
          model: Assessor,
          as: 'assessor',
          attributes: ['id', 'name', 'email']
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
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

  async create(assessorData) {
    return await Assessor.create(assessorData);
  }

  async update(id, assessorData) {
    const [updatedRowsCount] = await Assessor.update(assessorData, {
      where: { id }
    });
    
    if (updatedRowsCount === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    return await Assessor.destroy({
      where: { id }
    });
  }

  async updateParticipantCounts(assessorId) {
    const belumCount = await Participant.count({
      where: { 
        asesor_id: assessorId,
        status: 'BELUM'
      }
    });

    const sudahCount = await Participant.count({
      where: { 
        asesor_id: assessorId,
        status: 'SUDAH'
      }
    });

    await Assessor.update({
      total_peserta_belum_asesmen: belumCount,
      total_peserta_selesai_asesmen: sudahCount
    }, {
      where: { id: assessorId }
    });

    return { belumCount, sudahCount };
  }

  async getStatistics(assessorId) {
    const assessor = await this.findById(assessorId);
    
    if (!assessor) {
      return null;
    }

    const statistics = {
      total_participants: assessor.participants.length,
      belum_dinilai: assessor.participants.filter(p => p.status === 'BELUM').length,
      sudah_dinilai: assessor.participants.filter(p => p.status === 'SUDAH').length
    };

    return {
      assessor,
      statistics
    };
  }
}

module.exports = new AssessorRepository();
