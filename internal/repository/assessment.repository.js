const { Assessment, Participant, Assessor } = require('../models');
const { Op } = require('sequelize');

class AssessmentRepository {
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
      'hasil_assessment': 'hasil_assessment',
      'catatan': 'catatan',
      'tanggal_assessment': 'tanggal_assessment'
    };

    const orderField = sortFieldMapping[sortBy] || 'createdAt';

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

    // Search in related models
    const includeWhere = [];
    if (search) {
      includeWhere.push({
        model: Participant,
        as: 'peserta',
        where: {
          [Op.or]: [
            { nama: { [Op.iLike]: `%${search}%` } },
            { nip: { [Op.iLike]: `%${search}%` } }
          ]
        },
        required: true
      });
    } else {
      includeWhere.push({
        model: Participant,
        as: 'peserta',
        attributes: ['id', 'nama', 'nip']
      });
    }

    includeWhere.push({
      model: Assessor,
      as: 'assessor',
      attributes: ['id', 'name', 'email']
    });

    const { count, rows } = await Assessment.findAndCountAll({
      where: filterWhere,
      include: includeWhere,
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
    return await Assessment.findByPk(id, {
      include: [
        {
          model: Participant,
          as: 'peserta',
          attributes: ['id', 'nama', 'nip']
        },
        {
          model: Assessor,
          as: 'assessor',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
  }

  async findByParticipant(participantId, options = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      filters = [],
      noPagination = false
    } = options;

    const offset = noPagination ? 0 : (page - 1) * limit;

    // Map sortBy to actual field names
    const sortFieldMapping = {
      'createdAt': 'createdAt',
      'updatedAt': 'updatedAt',
      'hasil_assessment': 'hasil_assessment',
      'catatan': 'catatan',
      'tanggal_assessment': 'tanggal_assessment'
    };

    const orderField = sortFieldMapping[sortBy] || 'createdAt';

    // Build advanced filters
    const filterConditions = { peserta_id: participantId };
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
        'id', 'hasil_assessment', 'catatan', 'tanggal_assessment',
        'createdAt', 'updatedAt', 'asesor_id', 'peserta_id'
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

    const queryOptions = {
      where: filterConditions,
      include: [
        {
          model: Participant,
          as: 'peserta',
          attributes: ['id', 'nama', 'nip']
        },
        {
          model: Assessor,
          as: 'assessor',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [[orderField, sortOrder.toUpperCase()]],
      distinct: true
    };

    if (!noPagination) {
      queryOptions.limit = parseInt(limit);
      queryOptions.offset = offset;
    }

    const { count, rows } = await Assessment.findAndCountAll(queryOptions);

    if (noPagination) {
      // Return all data without pagination
      return {
        data: rows,
        total: count
      };
    }

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

  async findByAssessor(assessorId, options = {}) {
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
      'hasil_assessment': 'hasil_assessment',
      'catatan': 'catatan',
      'tanggal_assessment': 'tanggal_assessment'
    };

    const orderField = sortFieldMapping[sortBy] || 'createdAt';

    // Build advanced filters for assessment
    const filterConditions = { asesor_id: assessorId };
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
        'id', 'hasil_assessment', 'catatan', 'tanggal_assessment',
        'createdAt', 'updatedAt', 'asesor_id', 'peserta_id'
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

    // Search in participant name/nip
    const includeWhere = [];
    if (search) {
      includeWhere.push({
        model: Participant,
        as: 'peserta',
        where: {
          [Op.or]: [
            { nama: { [Op.iLike]: `%${search}%` } },
            { nip: { [Op.iLike]: `%${search}%` } }
          ]
        },
        required: true,
        attributes: ['id', 'nama', 'nip']
      });
    } else {
      includeWhere.push({
        model: Participant,
        as: 'peserta',
        attributes: ['id', 'nama', 'nip']
      });
    }

    includeWhere.push({
      model: Assessor,
      as: 'assessor',
      attributes: ['id', 'name', 'email']
    });

    const { count, rows } = await Assessment.findAndCountAll({
      where: filterConditions,
      include: includeWhere,
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

  async create(assessmentData) {
    return await Assessment.create(assessmentData);
  }

  async bulkCreate(assessmentsData) {
    return await Assessment.bulkCreate(assessmentsData, {
      returning: true
    });
  }

  async update(id, assessmentData) {
    const [updatedRowsCount] = await Assessment.update(assessmentData, {
      where: { id }
    });
    
    if (updatedRowsCount === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async delete(id) {
    return await Assessment.destroy({
      where: { id }
    });
  }

  async deleteByParticipantAndAssessor(participantId, assessorId) {
    return await Assessment.destroy({
      where: {
        peserta_id: participantId,
        asesor_id: assessorId
      }
    });
  }

  async getParticipantSummary(participantId) {
    const assessments = await Assessment.findAll({
      where: { peserta_id: participantId },
      include: [
        {
          model: Assessor,
          as: 'assessor',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['kategori', 'ASC'], ['huruf', 'ASC']]
    });

    // Group by kategori
    const summary = {};
    assessments.forEach(assessment => {
      if (!summary[assessment.kategori]) {
        summary[assessment.kategori] = [];
      }
      summary[assessment.kategori].push({
        huruf: assessment.huruf,
        nilai: assessment.nilai,
        assessor: assessment.assessor
      });
    });

    return {
      participant_id: participantId,
      assessments: summary,
      total_assessments: assessments.length
    };
  }

  async getAssessorSummary(assessorId) {
    const assessments = await Assessment.findAll({
      where: { asesor_id: assessorId },
      include: [
        {
          model: Participant,
          as: 'peserta',
          attributes: ['id', 'nama', 'nip']
        }
      ],
      order: [['peserta_id', 'ASC'], ['kategori', 'ASC']]
    });

    // Group by participant
    const summary = {};
    assessments.forEach(assessment => {
      const participantId = assessment.peserta_id;
      if (!summary[participantId]) {
        summary[participantId] = {
          participant: assessment.participant,
          assessments: {}
        };
      }
      
      if (!summary[participantId].assessments[assessment.kategori]) {
        summary[participantId].assessments[assessment.kategori] = [];
      }
      
      summary[participantId].assessments[assessment.kategori].push({
        huruf: assessment.huruf,
        nilai: assessment.nilai
      });
    });

    return {
      assessor_id: assessorId,
      participants: summary,
      total_assessments: assessments.length
    };
  }
}

module.exports = new AssessmentRepository();
