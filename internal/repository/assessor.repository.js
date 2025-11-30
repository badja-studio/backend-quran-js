const { Assessor, User, Participant, Assessment } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../../config/database');

class AssessorRepository {
  async findAll(options = {}) {
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
      'name': 'name',
      'username': 'username',
      'email': 'email',
      'no_telepon': 'no_telepon'
    };

    const orderField = sortFieldMapping[sortBy] || 'createdAt';

    // Build where clause for search
    const searchWhere = search ? {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { no_telepon: { [Op.iLike]: `%${search}%` } }
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
          case 'eq': case '=':
            sequelizeOp = Op.eq;
            break;
          case 'ne': case '!=':
            sequelizeOp = Op.ne;
            break;
          case 'gt': case '>':
            sequelizeOp = Op.gt;
            break;
          case 'gte': case '>=':
            sequelizeOp = Op.gte;
            break;
          case 'lt': case '<':
            sequelizeOp = Op.lt;
            break;
          case 'lte': case '<=':
            sequelizeOp = Op.lte;
            break;
          case 'like':
            sequelizeOp = Op.like;
            break;
          case 'ilike':
            sequelizeOp = Op.iLike;
            break;
          case 'in':
            sequelizeOp = Op.in;
            break;
          case 'notin': case 'not_in':
            sequelizeOp = Op.notIn;
            break;
          case 'between':
            sequelizeOp = Op.between;
            break;
          case 'notbetween': case 'not_between':
            sequelizeOp = Op.notBetween;
            break;
          case 'isnull': case 'is_null':
            filterWhere[field] = { [Op.is]: null };
            return;
          case 'isnotnull': case 'is_not_null':
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
          finalValue = `%${value}%`;
        }

        // Apply filter condition
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
      ...filterWhere
    };

    const { count, rows } = await Assessor.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'akun',
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
    return await Assessor.findByPk(id, {
      include: [
        {
          model: User,
          as: 'akun',
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

  async findByUsername(username) {
    return await Assessor.findOne({
      where: { username: username },
      include: [
        {
          model: User,
          as: 'akun',
          attributes: ['id', 'username', 'role']
        }
      ]
    });
  }

  async findWithParticipants(assessorId, options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      status = null,
      filters = []
    } = options;

    const offset = (page - 1) * limit;

    // Map sortBy to actual field names (participant fields)
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

    // Build participant search where clause
    const participantSearchWhere = search ? {
      [Op.or]: [
        { nama: { [Op.iLike]: `%${search}%` } },
        { nip: { [Op.iLike]: `%${search}%` } },
        { no_akun: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    // Build advanced filters for participants
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

    // Add status filter if provided
    const participantWhere = {
      ...participantSearchWhere,
      ...filterConditions,
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

  async create(assessorData, options = {}) {
    return await Assessor.create(assessorData, options);
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

  /**
   * Get real-time assessment counts for an assessor
   * @param {string} assessorId - Assessor ID
   * @returns {Object} - Real-time counts
   */
  async getRealTimeAssessmentCounts(assessorId) {
    try {
      // Get participants assigned to this assessor
      const participants = await Participant.findAll({
        where: { asesor_id: assessorId },
        attributes: ['id', 'status'],
        raw: true
      });

      if (participants.length === 0) {
        return {
          total_assigned: 0,
          assessed: 0,
          not_assessed: 0,
          assessment_progress: 0
        };
      }

      const participantIds = participants.map(p => p.id);

      // Get participants who have been assessed (have assessment records)
      const assessedParticipants = await Assessment.findAll({
        where: { 
          peserta_id: { [Op.in]: participantIds },
          asesor_id: assessorId
        },
        attributes: ['peserta_id'],
        group: ['peserta_id'],
        raw: true
      });

      const assessedCount = assessedParticipants.length;
      const totalAssigned = participants.length;
      const notAssessedCount = totalAssigned - assessedCount;
      const progressPercentage = totalAssigned > 0 ? Math.round((assessedCount / totalAssigned) * 100) : 0;

      return {
        total_assigned: totalAssigned,
        assessed: assessedCount,
        not_assessed: notAssessedCount,
        assessment_progress: progressPercentage,
        updated_at: new Date()
      };
    } catch (error) {
      console.error('Error getting real-time assessment counts:', error);
      throw new Error(`Failed to get assessment counts: ${error.message}`);
    }
  }

  /**
   * Get real-time counts for all assessors
   * @returns {Object} - Counts by assessor ID
   */
  async getAllAssessorsRealTimeCounts() {
    try {
      // Get all assessors with their assigned participants
      const assessorsWithParticipants = await Assessor.findAll({
        include: [{
          model: Participant,
          as: 'participants',
          attributes: ['id', 'status'],
          required: false
        }],
        attributes: ['id', 'name', 'username']
      });

      const countsPromises = assessorsWithParticipants.map(async (assessor) => {
        const counts = await this.getRealTimeAssessmentCounts(assessor.id);
        return {
          assessor_id: assessor.id,
          assessor_name: assessor.name,
          assessor_username: assessor.username,
          ...counts
        };
      });

      const allCounts = await Promise.all(countsPromises);

      // Convert to object with assessor ID as key
      const countsByAssessor = {};
      allCounts.forEach(count => {
        countsByAssessor[count.assessor_id] = count;
      });

      return countsByAssessor;
    } catch (error) {
      console.error('Error getting all assessors real-time counts:', error);
      throw new Error(`Failed to get all assessor counts: ${error.message}`);
    }
  }

  /**
   * Enhanced findAll that includes real-time assessment counts
   * @param {Object} options - Query options
   * @returns {Object} - Assessors with real-time counts
   */
  async findAllWithCounts(options = {}) {
    try {
      // Get assessors using existing findAll method
      const result = await this.findAll(options);
      
      if (!result.data || result.data.length === 0) {
        return result;
      }

      // Get assessor IDs
      const assessorIds = result.data.map(assessor => assessor.id);

      // Get real-time counts for all these assessors
      const countsPromises = assessorIds.map(id => this.getRealTimeAssessmentCounts(id));
      const allCounts = await Promise.all(countsPromises);

      // Map counts to assessors
      const countsByAssessor = {};
      assessorIds.forEach((id, index) => {
        countsByAssessor[id] = allCounts[index];
      });

      // Add counts to assessor data
      result.data = result.data.map(assessor => ({
        ...assessor.toJSON(),
        realTimeCounts: countsByAssessor[assessor.id] || null
      }));

      return result;
    } catch (error) {
      console.error('Error in findAllWithCounts:', error);
      throw new Error(`Failed to get assessors with counts: ${error.message}`);
    }
  }

  /**
   * Enhanced findById that includes real-time assessment counts
   * @param {string} id - Assessor ID
   * @returns {Object} - Assessor with real-time counts
   */
  async findByIdWithCounts(id) {
    try {
      const assessor = await this.findById(id);
      
      if (!assessor) {
        return null;
      }

      // Get real-time counts for this assessor
      const counts = await this.getRealTimeAssessmentCounts(id);

      return {
        ...assessor.toJSON(),
        realTimeCounts: counts
      };
    } catch (error) {
      console.error('Error in findByIdWithCounts:', error);
      throw new Error(`Failed to get assessor with counts: ${error.message}`);
    }
  }
}

module.exports = new AssessorRepository();
