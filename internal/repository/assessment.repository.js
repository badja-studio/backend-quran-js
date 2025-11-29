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
      filters = {}
    } = options;

    const offset = (page - 1) * limit;

    // Build where clause for filters
    const filterWhere = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        filterWhere[key] = filters[key];
      }
    });

    // Search in related models
    const includeWhere = [];
    if (search) {
      includeWhere.push({
        model: Participant,
        as: 'participant',
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
        as: 'participant',
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
    return await Assessment.findByPk(id, {
      include: [
        {
          model: Participant,
          as: 'participant',
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
      sortOrder = 'DESC'
    } = options;

    const offset = (page - 1) * limit;

    const { count, rows } = await Assessment.findAndCountAll({
      where: { peserta_id: participantId },
      include: [
        {
          model: Participant,
          as: 'participant',
          attributes: ['id', 'nama', 'nip']
        },
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

  async findByAssessor(assessorId, options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = options;

    const offset = (page - 1) * limit;

    // Search in participant name/nip
    const includeWhere = [];
    if (search) {
      includeWhere.push({
        model: Participant,
        as: 'participant',
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
        as: 'participant',
        attributes: ['id', 'nama', 'nip']
      });
    }

    includeWhere.push({
      model: Assessor,
      as: 'assessor',
      attributes: ['id', 'name', 'email']
    });

    const { count, rows } = await Assessment.findAndCountAll({
      where: { asesor_id: assessorId },
      include: includeWhere,
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
          as: 'participant',
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
