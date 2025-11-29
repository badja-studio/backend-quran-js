const { Op, Sequelize } = require('sequelize');
const { sequelize } = require('../../config/database');
const { Participant, Assessor, Assessment, User } = require('../models');

class DashboardRepository {
    // Get basic statistics
    async getBasicStatistics() {
        const [
            totalParticipants,
            completedAssessments,
            totalAssessors,
            avgScore
        ] = await Promise.all([
            Participant.count(),
            Participant.count({ where: { status: 'SUDAH' } }),
            Assessor.count(),
            Assessment.findOne({
                attributes: [[Sequelize.fn('AVG', Sequelize.col('nilai')), 'average']],
                raw: true
            })
        ]);

        return {
            totalParticipants,
            completedAssessments,
            totalAssessors,
            avgScore: avgScore?.average || 0
        };
    }

    // Get participation statistics by education level
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

        // Map to match frontend expected format
        const levelMap = {
            'PAUD': 'PAUD/TK',
            'TK': 'PAUD/TK',
            'SD': 'SD/Sederajat',
            'SMP': 'SMP/Sederajat',
            'SMA': 'SMA/Umum',
            'SMK': 'SMA/Umum'
        };

        const aggregated = {};
        result.forEach(item => {
            const mappedLevel = levelMap[item.jenjang] || item.jenjang || 'Lainnya';
            if (!aggregated[mappedLevel]) {
                aggregated[mappedLevel] = { total: 0, completed: 0 };
            }
            aggregated[mappedLevel].total += parseInt(item.total);
            aggregated[mappedLevel].completed += parseInt(item.completed);
        });

        return Object.entries(aggregated).map(([title, data]) => ({
            title,
            total: data.total,
            done: data.completed
        }));
    }

    // Get participation by province
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

    // Get gender distribution
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

    // Get employee status distribution
    async getEmployeeStatusDistribution() {
        // Assuming we need to determine PNS vs Non-PNS from NIP pattern or other field
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

    // Get institution type distribution
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

    // Get average scores by education level
    async getAverageScoresByEducationLevel() {
        const result = await Assessment.findAll({
            attributes: [
                [Sequelize.col('peserta.jenjang'), 'jenjang'],
                [Sequelize.fn('AVG', Sequelize.col('Assessment.nilai')), 'avgScore']
            ],
            include: [{
                model: Participant,
                as: 'peserta',
                attributes: []
            }],
            group: [Sequelize.col('peserta.jenjang')],
            raw: true
        });

        const levelMap = {
            'PAUD': 'Rata² PAUD/TK',
            'TK': 'Rata² PAUD/TK',
            'SD': 'Rata² SD',
            'SMP': 'Rata² SMP',
            'SMA': 'Rata² SMA/Umum',
            'SMK': 'Rata² SMA/Umum'
        };

        const aggregated = {};
        result.forEach(item => {
            const mappedLevel = levelMap[item.jenjang] || `Rata² ${item.jenjang}`;
            if (!aggregated[mappedLevel]) {
                aggregated[mappedLevel] = { total: 0, count: 0 };
            }
            aggregated[mappedLevel].total += parseFloat(item.avgScore);
            aggregated[mappedLevel].count += 1;
        });

        // Add overall average
        const overallAvg = await Assessment.findOne({
            attributes: [[Sequelize.fn('AVG', Sequelize.col('nilai')), 'average']],
            raw: true
        });

        const results = Object.entries(aggregated).map(([label, data]) => ({
            label,
            value: (data.total / data.count).toFixed(2)
        }));

        // Add overall average at the beginning
        results.unshift({
            label: 'Rata² Nilai Peserta',
            value: parseFloat(overallAvg?.average || 0).toFixed(2)
        });

        return results;
    }

    // Get province achievement data
    async getProvinceAchievementData() {
        const result = await Assessment.findAll({
            attributes: [
                [Sequelize.col('peserta.provinsi'), 'provinsi'],
                [Sequelize.fn('MIN', Sequelize.col('Assessment.nilai')), 'terendah'],
                [Sequelize.fn('MAX', Sequelize.col('Assessment.nilai')), 'tertinggi'],
                [Sequelize.fn('AVG', Sequelize.col('Assessment.nilai')), 'rata']
            ],
            include: [{
                model: Participant,
                as: 'peserta',
                attributes: [],
                where: {
                    provinsi: { [Op.not]: null }
                }
            }],
            group: [Sequelize.col('peserta.provinsi')],
            raw: true
        });

        return result.map(item => ({
            name: item.provinsi,
            terendah: parseFloat(item.terendah),
            tertinggi: parseFloat(item.tertinggi),
            rata: parseFloat(item.rata)
        }));
    }

    // Get fluency level distribution by province
    async getFluencyLevelByProvince() {
        // This would need to be calculated based on assessment scores
        // For now, we'll create a mock structure that can be filled with real logic
        const result = await Assessment.findAll({
            attributes: [
                [Sequelize.col('peserta.provinsi'), 'provinsi'],
                [Sequelize.literal("CASE WHEN Assessment.nilai >= 90 THEN 'mahir' WHEN Assessment.nilai >= 75 THEN 'lancar' ELSE 'kurang_lancar' END"), 'tingkat'],
                [Sequelize.fn('COUNT', Sequelize.col('Assessment.id')), 'jumlah']
            ],
            include: [{
                model: Participant,
                as: 'peserta',
                attributes: [],
                where: {
                    provinsi: { [Op.not]: null }
                }
            }],
            group: [Sequelize.col('peserta.provinsi'), Sequelize.literal("CASE WHEN Assessment.nilai >= 90 THEN 'mahir' WHEN Assessment.nilai >= 75 THEN 'lancar' ELSE 'kurang_lancar' END")],
            raw: true
        });

        // Group by province
        const provinceData = {};
        result.forEach(item => {
            if (!provinceData[item.provinsi]) {
                provinceData[item.provinsi] = {
                    name: item.provinsi,
                    lancar: 0,
                    mahir: 0,
                    kurang_lancar: 0
                };
            }
            provinceData[item.provinsi][item.tingkat] = parseInt(item.jumlah);
        });

        // Convert to percentage
        return Object.values(provinceData).map(province => {
            const total = province.lancar + province.mahir + province.kurang_lancar;
            return {
                name: province.name,
                lancar: Math.round((province.lancar / total) * 100),
                mahir: Math.round((province.mahir / total) * 100),
                kurang_lancar: Math.round((province.kurang_lancar / total) * 100)
            };
        });
    }

    // Get error statistics by category
    async getErrorStatisticsByCategory(category) {
        // This would need specific error tracking in assessments
        // For now, return mock structure that matches the frontend
        const mockData = {
            'makharij': [
                { name: 'ع', total: 18500 },
                { name: 'غ', total: 20500 },
                { name: 'خ', total: 25500 },
                { name: 'د', total: 30000 },
                { name: 'ط', total: 30500 },
                { name: 'ق', total: 39500 },
                { name: 'ك', total: 47000 },
                { name: 'ف', total: 36500 },
                { name: 'م', total: 20000 },
                { name: 'ل', total: 26000 }
            ],
            'sifat': [
                { name: 'ع', total: 35000 },
                { name: 'غ', total: 41000 },
                { name: 'خ', total: 18000 },
                { name: 'د', total: 29500 },
                { name: 'ط', total: 20000 },
                { name: 'ق', total: 45000 },
                { name: 'ك', total: 33000 },
                { name: 'ف', total: 15500 },
                { name: 'م', total: 27500 },
                { name: 'ل', total: 39000 }
            ],
            'ahkam': [
                { name: 'Ghünnah Musyaddadah', total: 52000 },
                { name: 'Idzghâm Bilaghünnah', total: 58000 },
                { name: 'Idzghâm Mutamassilain', total: 8000 },
                { name: 'Idzghâm Mutaqâribain', total: 10500 },
                { name: 'Ikhfâ', total: 68000 },
                { name: 'Iqlâb', total: 6500 },
                { name: 'Idzhâr Syafawi', total: 27000 },
                { name: 'Idzghâm Mimi', total: 12000 },
                { name: 'Ikhfâ Syafawi', total: 17000 },
                { name: 'Tanâfus', total: 32000 }
            ],
            'mad': [
                { name: 'Mad Aridlissukun', total: 10000 },
                { name: 'Mad Iwadh', total: 21000 },
                { name: 'Mad Jaiz Muntashil', total: 28000 },
                { name: 'Mad Lazim Harfi Musaqqal', total: 65000 },
                { name: 'Mad Lazim Kilmi Mukhaffaf', total: 19000 },
                { name: 'Mad Shilah Qashira', total: 10000 },
                { name: 'Mad Thabi\'i', total: 60000 },
                { name: 'Mad Wajib Muttashil', total: 35000 },
                { name: 'Qashr', total: 40000 },
                { name: 'Ziyadatul Mad', total: 55000 }
            ]
        };

        return mockData[category] || [];
    }

    // Get penalty statistics
    async getPenaltyStatistics() {
        // Mock data for penalty statistics
        return [
            { name: 'Kelebihan Waktu', total: 0.28 },
            { name: 'Tidak Bisa Membaca', total: 0.12 }
        ];
    }
}

module.exports = new DashboardRepository();
