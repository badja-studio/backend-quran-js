const { Op, Sequelize } = require('sequelize');
const { Participant, Assessor, Assessment } = require('../models');

/**
 * Simplified Dashboard Repository
 * - No complex SQL queries
 * - No Promise.all blocking
 * - Simple, fast, direct queries only
 */
class DashboardRepository {
    // Get total participants count
    async getTotalParticipants() {
        return await Participant.count();
    }

    // Get completed assessments count
    async getCompletedAssessments() {
        return await Participant.count({
            where: { status: 'SUDAH' }
        });
    }

    // Get total assessors count
    async getTotalAssessors() {
        return await Assessor.count();
    }

    // Get simple average score (without complex CTE)
    async getAverageScore() {
        const result = await Assessment.findOne({
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('nilai')), 'avg']
            ],
            raw: true
        });
        return parseFloat(result?.avg || 0).toFixed(2);
    }

    // Get participation by education level - simple GROUP BY
    async getParticipationByEducationLevel() {
        const result = await Participant.findAll({
            attributes: [
                'jenjang',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'total'],
                [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN status = 'SUDAH' THEN 1 ELSE 0 END")), 'completed']
            ],
            group: ['jenjang'],
            raw: true
        });

        return result.map(item => ({
            title: item.jenjang || 'Lainnya',
            total: parseInt(item.total),
            done: parseInt(item.completed)
        }));
    }

    // Get participation by province - simple GROUP BY
    async getParticipationByProvince() {
        const result = await Participant.findAll({
            attributes: [
                'provinsi',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'registered'],
                [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN status = 'SUDAH' THEN 1 ELSE 0 END")), 'participated']
            ],
            where: {
                provinsi: { [Op.not]: null }
            },
            group: ['provinsi'],
            raw: true
        });

        return result.map(item => ({
            name: item.provinsi,
            registered: parseInt(item.registered),
            participated: parseInt(item.participated)
        }));
    }

    // Get gender distribution - simple GROUP BY
    async getGenderDistribution() {
        const result = await Participant.findAll({
            attributes: [
                'jenis_kelamin',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            group: ['jenis_kelamin'],
            raw: true
        });

        return result.map(item => ({
            name: item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
            value: parseInt(item.count)
        }));
    }

    // Get employee status distribution - simple CASE WHEN
    async getEmployeeStatusDistribution() {
        const result = await Participant.findAll({
            attributes: [
                [Sequelize.literal("CASE WHEN LENGTH(nip) = 18 THEN 'PNS' ELSE 'Non-PNS' END"), 'status'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            group: [Sequelize.literal("CASE WHEN LENGTH(nip) = 18 THEN 'PNS' ELSE 'Non-PNS' END")],
            raw: true
        });

        return result.map(item => ({
            name: item.status,
            value: parseInt(item.count)
        }));
    }

    // Get institution type distribution - simple GROUP BY
    async getInstitutionTypeDistribution() {
        const result = await Participant.findAll({
            attributes: [
                'jenis_pt',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            where: {
                jenis_pt: { [Op.not]: null }
            },
            group: ['jenis_pt'],
            raw: true
        });

        return result.map(item => ({
            name: item.jenis_pt === 'NEGERI' ? 'Negeri' : 'Swasta',
            value: parseInt(item.count)
        }));
    }

    // Get simple average scores by education level
    async getAverageScoresByEducationLevel() {
        const result = await Participant.findAll({
            attributes: [
                'jenjang',
                [Sequelize.fn('AVG', Sequelize.col('Assessment.nilai')), 'avg_score']
            ],
            include: [{
                model: Assessment,
                attributes: [],
                required: true
            }],
            group: ['Participant.jenjang'],
            raw: true
        });

        return result.map(item => ({
            label: `Rata² ${item.jenjang || 'Lainnya'}`,
            value: parseFloat(item.avg_score || 0).toFixed(2)
        }));
    }

    // Get province achievement data - simple MIN/MAX/AVG
    async getProvinceAchievementData() {
        const result = await Participant.findAll({
            attributes: [
                'provinsi',
                [Sequelize.fn('MIN', Sequelize.col('Assessment.nilai')), 'terendah'],
                [Sequelize.fn('MAX', Sequelize.col('Assessment.nilai')), 'tertinggi'],
                [Sequelize.fn('AVG', Sequelize.col('Assessment.nilai')), 'rata']
            ],
            include: [{
                model: Assessment,
                attributes: [],
                required: true
            }],
            where: {
                provinsi: { [Op.not]: null }
            },
            group: ['Participant.provinsi'],
            raw: true
        });

        return result.map(item => ({
            name: item.provinsi,
            terendah: parseFloat(item.terendah || 0).toFixed(2),
            tertinggi: parseFloat(item.tertinggi || 0).toFixed(2),
            rata: parseFloat(item.rata || 0).toFixed(2)
        }));
    }

    // Get fluency level by province - simple COUNT with CASE
    async getFluencyLevelByProvince() {
        const result = await Participant.findAll({
            attributes: [
                'provinsi',
                [Sequelize.literal("COUNT(CASE WHEN \"Assessment\".\"nilai\" >= 90 THEN 1 END)"), 'lancar'],
                [Sequelize.literal("COUNT(CASE WHEN \"Assessment\".\"nilai\" >= 75 AND \"Assessment\".\"nilai\" < 90 THEN 1 END)"), 'mahir'],
                [Sequelize.literal("COUNT(CASE WHEN \"Assessment\".\"nilai\" < 75 THEN 1 END)"), 'kurang_lancar']
            ],
            include: [{
                model: Assessment,
                attributes: [],
                required: true
            }],
            where: {
                provinsi: { [Op.not]: null }
            },
            group: ['Participant.provinsi'],
            raw: true
        });

        return result.map(item => ({
            name: item.provinsi,
            lancar: parseInt(item.lancar || 0),
            mahir: parseInt(item.mahir || 0),
            kurang_lancar: parseInt(item.kurang_lancar || 0)
        }));
    }

    // Get error statistics by category - simple WHERE + GROUP BY
    async getErrorStatisticsByCategory(category) {
        const result = await Assessment.findAll({
            attributes: [
                'huruf',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'total']
            ],
            where: {
                kategori: {
                    [Op.iLike]: `%${category}%`
                },
                nilai: { [Op.lt]: 100 }
            },
            group: ['huruf'],
            order: [[Sequelize.literal('total'), 'DESC']],
            limit: 10,
            raw: true
        });

        return result.map(item => ({
            name: item.huruf || 'Unknown',
            total: parseInt(item.total)
        }));
    }

    // Get penalty statistics - simple mock data
    async getPenaltyStatistics() {
        return [
            { name: 'Kelebihan Waktu', total: 0.28 },
            { name: 'Tidak Bisa Membaca', total: 0.12 }
        ];
    }
}

module.exports = new DashboardRepository();
