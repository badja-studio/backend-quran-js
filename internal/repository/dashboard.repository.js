const { Op, Sequelize, QueryTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const { Participant, Assessor, Assessment } = require('../models');

/**
 * OPTIMIZED Dashboard Repository for MILLIONS of records
 *
 * Key optimizations:
 * 1. Uses RAW SQL for complex aggregations (avoids Sequelize JOIN overhead)
 * 2. Adds LIMIT to prevent memory issues
 * 3. Uses database-side aggregation (no in-memory processing)
 * 4. Designed for growth - handles 1M+ records efficiently
 *
 * REQUIRES: Indexes from add-dashboard-indexes.sql must be installed!
 * Run: psql -h localhost -U user -d db -f add-dashboard-indexes.sql
 */
class DashboardRepository {
    // Get total participants count - SAFE (uses COUNT only)
    async getTotalParticipants() {
        return await Participant.count();
    }

    // Get completed assessments count - SAFE (uses COUNT with WHERE)
    async getCompletedAssessments() {
        return await Participant.count({
            where: { status: 'SUDAH' }
        });
    }

    // Get total assessors count - SAFE
    async getTotalAssessors() {
        return await Assessor.count();
    }

    // Get average score - OPTIMIZED with RAW SQL
    async getAverageScore() {
        const [result] = await sequelize.query(
            'SELECT AVG(nilai)::numeric(10,2) as avg FROM assessments',
            { type: QueryTypes.SELECT }
        );
        return parseFloat(result?.avg || 0).toFixed(2);
    }

    // Get participation by education level - SAFE (GROUP BY on indexed column)
    async getParticipationByEducationLevel() {
        // Uses idx_participants_jenjang index
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

    // Get participation by province - OPTIMIZED with LIMIT and RAW SQL
    async getParticipationByProvince() {
        // Uses idx_participants_provinsi index
        // LIMIT 50 prevents memory issues with thousands of provinces
        const result = await sequelize.query(`
            SELECT
                provinsi as name,
                COUNT(*) as registered,
                COUNT(CASE WHEN status = 'SUDAH' THEN 1 END) as participated
            FROM participants
            WHERE provinsi IS NOT NULL
            GROUP BY provinsi
            ORDER BY participated DESC
            LIMIT 50
        `, { type: QueryTypes.SELECT });

        return result.map(item => ({
            name: item.name,
            registered: parseInt(item.registered),
            participated: parseInt(item.participated)
        }));
    }

    // Get gender distribution - SAFE (simple GROUP BY)
    async getGenderDistribution() {
        // Uses idx_participants_jenis_kelamin index
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

    // Get employee status distribution - SAFE
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

    // Get institution type distribution - SAFE
    async getInstitutionTypeDistribution() {
        // Uses idx_participants_jenis_pt index
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

    // Get average scores by education level - OPTIMIZED with RAW SQL
    // Uses idx_assessments_peserta_id for efficient JOIN
    async getAverageScoresByEducationLevel() {
        const result = await sequelize.query(`
            SELECT
                p.jenjang,
                AVG(a.nilai)::numeric(10,2) as avg_score,
                COUNT(DISTINCT p.id) as participant_count
            FROM participants p
            INNER JOIN assessments a ON p.id = a.peserta_id
            WHERE p.jenjang IS NOT NULL
            GROUP BY p.jenjang
            ORDER BY avg_score DESC
        `, { type: QueryTypes.SELECT });

        return result.map(item => ({
            label: `Rata² ${item.jenjang}`,
            value: parseFloat(item.avg_score || 0).toFixed(2)
        }));
    }

    // Get province achievement data - OPTIMIZED with RAW SQL + LIMIT
    // Uses idx_assessments_peserta_id for efficient JOIN
    async getProvinceAchievementData() {
        const result = await sequelize.query(`
            SELECT
                p.provinsi as name,
                MIN(a.nilai)::numeric(10,2) as terendah,
                MAX(a.nilai)::numeric(10,2) as tertinggi,
                AVG(a.nilai)::numeric(10,2) as rata,
                COUNT(DISTINCT p.id) as participant_count
            FROM participants p
            INNER JOIN assessments a ON p.id = a.peserta_id
            WHERE p.provinsi IS NOT NULL
            GROUP BY p.provinsi
            HAVING COUNT(DISTINCT p.id) >= 10
            ORDER BY rata DESC
            LIMIT 50
        `, { type: QueryTypes.SELECT });

        return result.map(item => ({
            name: item.name,
            terendah: parseFloat(item.terendah || 0).toFixed(2),
            tertinggi: parseFloat(item.tertinggi || 0).toFixed(2),
            rata: parseFloat(item.rata || 0).toFixed(2)
        }));
    }

    // Get fluency level by province - OPTIMIZED with RAW SQL + LIMIT
    // Uses idx_assessments_peserta_id for efficient JOIN
    async getFluencyLevelByProvince() {
        const result = await sequelize.query(`
            SELECT
                p.provinsi as name,
                COUNT(CASE WHEN a.nilai >= 90 THEN 1 END) as lancar,
                COUNT(CASE WHEN a.nilai >= 75 AND a.nilai < 90 THEN 1 END) as mahir,
                COUNT(CASE WHEN a.nilai < 75 THEN 1 END) as kurang_lancar,
                COUNT(DISTINCT p.id) as participant_count
            FROM participants p
            INNER JOIN assessments a ON p.id = a.peserta_id
            WHERE p.provinsi IS NOT NULL
            GROUP BY p.provinsi
            HAVING COUNT(DISTINCT p.id) >= 10
            ORDER BY lancar DESC
            LIMIT 50
        `, { type: QueryTypes.SELECT });

        return result.map(item => ({
            name: item.name,
            lancar: parseInt(item.lancar || 0),
            mahir: parseInt(item.mahir || 0),
            kurang_lancar: parseInt(item.kurang_lancar || 0)
        }));
    }

    // Get error statistics by category - OPTIMIZED with LIMIT
    // Uses idx_assessments_kategori_huruf index
    async getErrorStatisticsByCategory(category) {
        const result = await sequelize.query(`
            SELECT
                huruf as name,
                COUNT(*) as total
            FROM assessments
            WHERE kategori ILIKE :category
                AND nilai < 100
            GROUP BY huruf
            ORDER BY total DESC
            LIMIT 10
        `, {
            replacements: { category: `%${category}%` },
            type: QueryTypes.SELECT
        });

        return result.map(item => ({
            name: item.name || 'Unknown',
            total: parseInt(item.total)
        }));
    }

    // Get penalty statistics
    async getPenaltyStatistics() {
        return [
            { name: 'Kelebihan Waktu', total: 0.28 },
            { name: 'Tidak Bisa Membaca', total: 0.12 }
        ];
    }
}

module.exports = new DashboardRepository();
