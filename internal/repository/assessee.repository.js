const { User, Assessment, AssesseeAssessor, AssesseeGroup } = require('../models');
const { Op } = require('sequelize');

class AssesseeRepository {
    /**
     * Get assessees with pagination, search, and sorting
     * @param {Object} options - Query options
     * @param {number} options.page - Page number
     * @param {number} options.limit - Items per page
     * @param {string} options.search - Search query
     * @param {string} options.sortBy - Field to sort by
     * @param {string} options.sortOrder - Sort order (ASC or DESC)
     * @param {Object} options.where - Additional where conditions
     * @param {Array} options.include - Additional includes
     * @returns {Promise<Object>} Paginated results
     */
    async findWithPagination({ page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'DESC', where = {}, include = [] }) {
        const offset = (page - 1) * limit;
        
        // Build search conditions
        const searchConditions = search ? {
            [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { fullname: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { username: { [Op.iLike]: `%${search}%` } },
                { siagaNumber: { [Op.iLike]: `%${search}%` } },
                { accountNumber: { [Op.iLike]: `%${search}%` } },
                { nip: { [Op.iLike]: `%${search}%` } },
                { schoolName: { [Op.iLike]: `%${search}%` } },
                { district: { [Op.iLike]: `%${search}%` } },
                { province: { [Op.iLike]: `%${search}%` } }
            ]
        } : {};

        // Combine conditions
        const whereConditions = {
            roles: 'Assessee',
            ...where,
            ...searchConditions
        };

        // Execute query with count
        const { count, rows } = await User.findAndCountAll({
            where: whereConditions,
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: User,
                    as: 'assessors',
                    attributes: ['id', 'name', 'fullname', 'waLink'],
                    through: { attributes: [] }
                },
                ...include
            ],
            limit: parseInt(limit),
            offset: offset,
            order: [[sortBy, sortOrder.toUpperCase()]],
            distinct: true
        });

        // Calculate pagination metadata
        const totalPages = Math.ceil(count / limit);
        const currentPage = parseInt(page);

        return {
            data: rows,
            pagination: {
                total: count,
                page: currentPage,
                limit: parseInt(limit),
                totalPages,
                hasNext: currentPage < totalPages,
                hasPrevious: currentPage > 1
            }
        };
    }

    /**
     * Get assessees who have not been assessed yet
     */
    async findNotAssessed({ page, limit, search, sortBy, sortOrder }) {
        // Get all assessee IDs that have assessments
        const assessedIds = await Assessment.findAll({
            attributes: ['assesseeId'],
            group: ['assesseeId'],
            raw: true
        });

        const assessedIdList = assessedIds.map(a => a.assesseeId);

        // Find assessees NOT in the assessed list
        const where = {
            id: { [Op.notIn]: assessedIdList.length > 0 ? assessedIdList : ['00000000-0000-0000-0000-000000000000'] }
        };

        return this.findWithPagination({ page, limit, search, sortBy, sortOrder, where });
    }

    /**
     * Get assessees ready for assessment (has assessor AND criteria group, but no assessment yet)
     */
    async findReadyForAssessment({ page, limit, search, sortBy, sortOrder }) {
        // Get assessees with assessors
        const assesseesWithAssessors = await AssesseeAssessor.findAll({
            attributes: ['assesseeId'],
            group: ['assesseeId'],
            raw: true
        });

        // Get assessees with criteria groups
        const assesseesWithGroups = await AssesseeGroup.findAll({
            attributes: ['assesseeId'],
            group: ['assesseeId'],
            raw: true
        });

        // Get assessees with assessments
        const assesseesWithAssessments = await Assessment.findAll({
            attributes: ['assesseeId'],
            group: ['assesseeId'],
            raw: true
        });

        const withAssessorIds = new Set(assesseesWithAssessors.map(a => a.assesseeId));
        const withGroupIds = new Set(assesseesWithGroups.map(a => a.assesseeId));
        const withAssessmentIds = new Set(assesseesWithAssessments.map(a => a.assesseeId));

        // Find assessees that have both assessor AND group, but NO assessment
        const readyIds = Array.from(withAssessorIds).filter(id => 
            withGroupIds.has(id) && !withAssessmentIds.has(id)
        );

        const where = readyIds.length > 0 
            ? { id: { [Op.in]: readyIds } }
            : { id: '00000000-0000-0000-0000-000000000000' }; // No results

        return this.findWithPagination({ page, limit, search, sortBy, sortOrder, where });
    }

    /**
     * Get assessees with assessment results
     */
    async findWithResults({ page, limit, search, sortBy, sortOrder }) {
        // Get all assessee IDs that have assessments
        const assessedIds = await Assessment.findAll({
            attributes: ['assesseeId'],
            group: ['assesseeId'],
            raw: true
        });

        const assessedIdList = assessedIds.map(a => a.assesseeId);

        // Find assessees IN the assessed list
        const where = assessedIdList.length > 0
            ? { id: { [Op.in]: assessedIdList } }
            : { id: '00000000-0000-0000-0000-000000000000' }; // No results

        return this.findWithPagination({ page, limit, search, sortBy, sortOrder, where });
    }
}

module.exports = new AssesseeRepository();
