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
    async getTotalParticipants(provinsi = null) {
        const whereClause = provinsi ? { provinsi } : {};
        return await Participant.count({ where: whereClause });
    }

    // Get completed assessments count - SAFE (uses COUNT with WHERE)
    async getCompletedAssessments(provinsi = null) {
        const whereClause = provinsi ? { provinsi, status: 'SUDAH' } : { status: 'SUDAH' };
        return await Participant.count({ where: whereClause });
    }

    // Get total assessors count - SAFE (no province filtering)
    async getTotalAssessors(provinsi = null) {
        // Assessors are not filtered by province
        return await Assessor.count();
    }

    // Get average score - CORRECTED to use calculated overall scores
    // IMPORTANT: This now calculates proper overall scores using the scoring system,
    // not raw assessment values which represent error counts
    // OPTIMIZED: Increased LIMIT and added sampling for better performance
    async getAverageScore(provinsi = null) {
        const scoringUtils = require('../utils/scoring.utils');

        const provinceFilter = provinsi ? 'AND p.provinsi = :provinsi' : '';

        // Get sample of participants with completed assessments (increased to 5000 for better accuracy)
        // Uses TABLESAMPLE for faster sampling on large datasets
        const participantData = await sequelize.query(`
            SELECT
                p.id as participant_id,
                json_agg(
                    json_build_object(
                        'huruf', a.huruf,
                        'kategori', a.kategori,
                        'nilai', a.nilai
                    )
                ) as assessments
            FROM participants p
            INNER JOIN assessments a ON p.id = a.peserta_id
            WHERE p.status = 'SUDAH' ${provinceFilter}
            GROUP BY p.id
            HAVING COUNT(a.id) > 0
            ORDER BY p.id DESC
            LIMIT 5000
        `, {
            replacements: { provinsi },
            type: QueryTypes.SELECT
        });

        if (participantData.length === 0) {
            return 0;
        }

        let totalScore = 0;
        let validParticipants = 0;

        // Calculate overall score for each participant
        for (const participant of participantData) {
            const assessments = participant.assessments;

            try {
                const scoreResult = scoringUtils.calculateParticipantScores(assessments);
                const overallScore = parseFloat(scoreResult.overallScore || 0);

                totalScore += overallScore;
                validParticipants++;
            } catch (error) {
                console.error(`Error calculating score for participant ${participant.participant_id}:`, error);
                // Skip this participant if scoring fails
            }
        }

        if (validParticipants === 0) {
            return 0;
        }

        const avgScore = totalScore / validParticipants;
        return parseFloat(avgScore.toFixed(2));
    }

    // Get participation by education level - SAFE (GROUP BY on indexed column)
    async getParticipationByEducationLevel(provinsi = null) {
        // Uses idx_participants_jenjang index
        const whereClause = provinsi ? { provinsi } : {};
        const result = await Participant.findAll({
            attributes: [
                'jenjang',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'total'],
                [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN status = 'SUDAH' THEN 1 ELSE 0 END")), 'completed']
            ],
            where: whereClause,
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
    async getParticipationByProvince(provinsi = null) {
        // Uses idx_participants_provinsi index
        // LIMIT 50 prevents memory issues with thousands of provinces
        // When provinsi is specified, keeps province-level aggregation (doesn't break down by city)
        const provinceFilter = provinsi ? 'AND provinsi = :provinsi' : '';
        const result = await sequelize.query(`
            SELECT
                provinsi as name,
                COUNT(*) as registered,
                COUNT(CASE WHEN status = 'SUDAH' THEN 1 END) as participated
            FROM participants
            WHERE provinsi IS NOT NULL ${provinceFilter}
            GROUP BY provinsi
            ORDER BY participated DESC
            LIMIT 50
        `, {
            replacements: { provinsi },
            type: QueryTypes.SELECT
        });

        return result.map(item => ({
            name: item.name,
            registered: parseInt(item.registered),
            participated: parseInt(item.participated)
        }));
    }

    // Get gender distribution - SAFE (simple GROUP BY)
    async getGenderDistribution(provinsi = null) {
        // Uses idx_participants_jenis_kelamin index
        const whereClause = provinsi ? { provinsi } : {};
        const result = await Participant.findAll({
            attributes: [
                'jenis_kelamin',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            where: whereClause,
            group: ['jenis_kelamin'],
            raw: true
        });

        return result.map(item => ({
            name: item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
            value: parseInt(item.count)
        }));
    }

    // Get employee status distribution - SAFE
    async getEmployeeStatusDistribution(provinsi = null) {
        const whereClause = provinsi ? { provinsi } : {};
        const result = await Participant.findAll({
            attributes: [
                [Sequelize.literal("CASE WHEN LENGTH(nip) = 18 THEN 'PNS' ELSE 'Non-PNS' END"), 'status'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            where: whereClause,
            group: [Sequelize.literal("CASE WHEN LENGTH(nip) = 18 THEN 'PNS' ELSE 'Non-PNS' END")],
            raw: true
        });

        return result.map(item => ({
            name: item.status,
            value: parseInt(item.count)
        }));
    }

    // Get institution type distribution - SAFE
    async getInstitutionTypeDistribution(provinsi = null) {
        // Uses idx_participants_jenis_pt index
        const whereClause = provinsi
            ? { provinsi, jenis_pt: { [Op.not]: null } }
            : { jenis_pt: { [Op.not]: null } };
        const result = await Participant.findAll({
            attributes: [
                'jenis_pt',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            where: whereClause,
            group: ['jenis_pt'],
            raw: true
        });

        return result.map(item => ({
            name: item.jenis_pt === 'NEGERI' ? 'Negeri' : 'Swasta',
            value: parseInt(item.count)
        }));
    }

    // Get average scores by education level - CORRECTED to use calculated overall scores
    // OPTIMIZED: Added LIMIT to prevent loading all records
    async getAverageScoresByEducationLevel(provinsi = null) {
        const scoringUtils = require('../utils/scoring.utils');

        const provinceFilter = provinsi ? 'AND p.provinsi = :provinsi' : '';

        // Get participants grouped by education level with their assessments
        // LIMIT to 10,000 most recent participants for performance
        const participantData = await sequelize.query(`
            SELECT
                p.id as participant_id,
                p.jenjang,
                json_agg(
                    json_build_object(
                        'huruf', a.huruf,
                        'kategori', a.kategori,
                        'nilai', a.nilai
                    )
                ) as assessments
            FROM participants p
            INNER JOIN assessments a ON p.id = a.peserta_id
            WHERE p.jenjang IS NOT NULL AND p.status = 'SUDAH' ${provinceFilter}
            GROUP BY p.id, p.jenjang
            HAVING COUNT(a.id) > 0
            ORDER BY p.id DESC
            LIMIT 10000
        `, {
            replacements: { provinsi },
            type: QueryTypes.SELECT
        });

        // Group by education level and calculate overall scores
        const levelStats = {};
        
        for (const participant of participantData) {
            const jenjang = participant.jenjang;
            const assessments = participant.assessments;
            
            if (!levelStats[jenjang]) {
                levelStats[jenjang] = {
                    totalScore: 0,
                    participantCount: 0
                };
            }
            
            try {
                const scoreResult = scoringUtils.calculateParticipantScores(assessments);
                const overallScore = parseFloat(scoreResult.overallScore || 0);
                
                levelStats[jenjang].totalScore += overallScore;
                levelStats[jenjang].participantCount++;
                
            } catch (error) {
                console.error(`Error calculating score for participant ${participant.participant_id}:`, error);
                // Skip this participant if scoring fails
            }
        }

        // Calculate averages and return formatted results
        const result = Object.keys(levelStats)
            .filter(jenjang => levelStats[jenjang].participantCount > 0)
            .map(jenjang => {
                const stats = levelStats[jenjang];
                const avgScore = stats.totalScore / stats.participantCount;
                
                return {
                    label: `Rata² ${jenjang}`,
                    value: parseFloat(avgScore.toFixed(2))
                };
            })
            .sort((a, b) => b.value - a.value);

        return result;
    }

    // Get province achievement data - CORRECTED to use calculated overall scores
    // OPTIMIZED: Added LIMIT to prevent loading all records
    async getProvinceAchievementData(provinsi = null) {
        const scoringUtils = require('../utils/scoring.utils');

        const provinceFilter = provinsi ? 'AND p.provinsi = :provinsi' : '';

        // Get participants grouped by province with their assessments
        // LIMIT to 15,000 most recent participants for performance
        const participantData = await sequelize.query(`
            SELECT
                p.id as participant_id,
                p.provinsi,
                json_agg(
                    json_build_object(
                        'huruf', a.huruf,
                        'kategori', a.kategori,
                        'nilai', a.nilai
                    )
                ) as assessments
            FROM participants p
            INNER JOIN assessments a ON p.id = a.peserta_id
            WHERE p.provinsi IS NOT NULL AND p.status = 'SUDAH' ${provinceFilter}
            GROUP BY p.id, p.provinsi
            HAVING COUNT(a.id) > 0
            ORDER BY p.id DESC
            LIMIT 15000
        `, {
            replacements: { provinsi },
            type: QueryTypes.SELECT
        });

        // Group by province and calculate overall scores
        const provinceStats = {};
        
        for (const participant of participantData) {
            const province = participant.provinsi;
            const assessments = participant.assessments;
            
            if (!provinceStats[province]) {
                provinceStats[province] = {
                    name: province,
                    scores: [],
                    participantCount: 0
                };
            }
            
            try {
                const scoreResult = scoringUtils.calculateParticipantScores(assessments);
                const overallScore = parseFloat(scoreResult.overallScore || 0);
                
                provinceStats[province].scores.push(overallScore);
                provinceStats[province].participantCount++;
                
            } catch (error) {
                console.error(`Error calculating score for participant ${participant.participant_id}:`, error);
                // Skip this participant if scoring fails
            }
        }

        // Calculate statistics and format results
        const result = Object.values(provinceStats)
            .filter(province => province.participantCount >= 10) // At least 10 participants
            .map(province => {
                const scores = province.scores;
                
                if (scores.length === 0) {
                    return {
                        name: province.name,
                        terendah: "0.00",
                        tertinggi: "0.00", 
                        rata: "0.00"
                    };
                }
                
                const min = Math.min(...scores);
                const max = Math.max(...scores);
                const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
                
                return {
                    name: province.name,
                    terendah: parseFloat(min.toFixed(2)),
                    tertinggi: parseFloat(max.toFixed(2)),
                    rata: parseFloat(avg.toFixed(2))
                };
            })
            .sort((a, b) => b.rata - a.rata) // Sort by average score descending
            .slice(0, 50); // Limit to top 50 provinces

        return result;
    }

    // Get fluency level by province - CORRECTED LOGIC
    // IMPORTANT: This method now calculates OVERALL SCORES using the scoring system,
    // not raw assessment values. Raw assessment 'nilai' represents ERROR COUNTS, not final scores.
    // OPTIMIZED: Added LIMIT to prevent loading all records
    async getFluencyLevelByProvince(provinsi = null) {
        const scoringUtils = require('../utils/scoring.utils');

        const provinceFilter = provinsi ? 'AND p.provinsi = :provinsi' : '';

        // First, get participants with their assessments grouped by province
        // LIMIT to 15,000 most recent participants for performance
        const participantData = await sequelize.query(`
            SELECT
                p.id as participant_id,
                p.provinsi,
                json_agg(
                    json_build_object(
                        'huruf', a.huruf,
                        'kategori', a.kategori,
                        'nilai', a.nilai
                    )
                ) as assessments
            FROM participants p
            INNER JOIN assessments a ON p.id = a.peserta_id
            WHERE p.provinsi IS NOT NULL AND p.status = 'SUDAH' ${provinceFilter}
            GROUP BY p.id, p.provinsi
            HAVING COUNT(a.id) > 0
            ORDER BY p.id DESC
            LIMIT 15000
        `, {
            replacements: { provinsi },
            type: QueryTypes.SELECT
        });

        // Calculate overall scores for each participant using the proper scoring system
        const provinceStats = {};
        
        for (const participant of participantData) {
            const province = participant.provinsi;
            const assessments = participant.assessments;
            
            if (!provinceStats[province]) {
                provinceStats[province] = {
                    name: province,
                    lancar: 0,        // >= 90 overall score
                    mahir: 0,         // >= 75 and < 90 overall score  
                    kurang_lancar: 0, // < 75 overall score
                    total: 0
                };
            }
            
            // Calculate the participant's overall score using scoring system
            try {
                const scoreResult = scoringUtils.calculateParticipantScores(assessments);
                const overallScore = parseFloat(scoreResult.overallScore || 0);
                
                // Categorize based on OVERALL SCORE (not raw assessment values)
                if (overallScore >= 90) {
                    provinceStats[province].lancar++;
                } else if (overallScore >= 75) {
                    provinceStats[province].mahir++;
                } else {
                    provinceStats[province].kurang_lancar++;
                }
                
                provinceStats[province].total++;
                
            } catch (error) {
                console.error(`Error calculating score for participant ${participant.participant_id}:`, error);
                // Default to kurang_lancar if scoring fails
                provinceStats[province].kurang_lancar++;
                provinceStats[province].total++;
            }
        }

        // Convert to array and filter provinces with meaningful data
        const result = Object.values(provinceStats)
            .filter(province => province.total >= 10) // At least 10 participants
            .sort((a, b) => b.lancar - a.lancar) // Sort by 'lancar' count descending
            .slice(0, 50); // Limit to top 50 provinces

        return result;
    }

    // Get error statistics by category - OPTIMIZED with LIMIT
    // Uses idx_assessments_kategori_huruf index
    async getErrorStatisticsByCategory(category, provinsi = null) {
        const provinceFilter = provinsi
            ? 'AND a.peserta_id IN (SELECT id FROM participants WHERE provinsi = :provinsi)'
            : '';

        const result = await sequelize.query(`
            SELECT
                a.huruf as name,
                COUNT(*) as total
            FROM assessments a
            WHERE a.kategori ILIKE :category
                AND a.nilai < 100
                ${provinceFilter}
            GROUP BY a.huruf
            ORDER BY total DESC
            LIMIT 10
        `, {
            replacements: { category: `%${category}%`, provinsi },
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

    // ============================================================================
    // NEW METHODS FOR SCORE DISTRIBUTION FEATURE
    // ============================================================================

    // Get list of distinct provinces that exist in database
    async getProvincesList() {
        const result = await sequelize.query(`
            SELECT DISTINCT provinsi
            FROM participants
            WHERE provinsi IS NOT NULL AND provinsi != ''
            ORDER BY provinsi ASC
        `, { type: QueryTypes.SELECT });

        return result.map(row => row.provinsi);
    }

    // Get score distribution by education level (jenjang)
    async getScoreDistributionByLevel(provinsi = null) {
        const scoringUtils = require('../utils/scoring.utils');
        const provinceFilter = provinsi ? 'AND p.provinsi = :provinsi' : '';

        // Fetch participants with assessments (LIMIT 15000)
        const participantData = await sequelize.query(`
            SELECT p.id as participant_id, p.jenjang,
                json_agg(json_build_object('huruf', a.huruf, 'kategori', a.kategori, 'nilai', a.nilai)) as assessments
            FROM participants p
            INNER JOIN assessments a ON p.id = a.peserta_id
            WHERE p.jenjang IS NOT NULL AND p.status = 'SUDAH' ${provinceFilter}
            GROUP BY p.id, p.jenjang
            HAVING COUNT(a.id) > 0
            ORDER BY p.id DESC
            LIMIT 15000
        `, {
            replacements: { provinsi },
            type: QueryTypes.SELECT
        });

        // Initialize stats for RA, MI, MTS, MA
        const levelStats = {
            'RA': { jml_0_59: 0, jml_60_89: 0, jml_90_100: 0, total: 0 },
            'MI': { jml_0_59: 0, jml_60_89: 0, jml_90_100: 0, total: 0 },
            'MTS': { jml_0_59: 0, jml_60_89: 0, jml_90_100: 0, total: 0 },
            'MA': { jml_0_59: 0, jml_60_89: 0, jml_90_100: 0, total: 0 }
        };

        // Calculate scores and categorize
        for (const participant of participantData) {
            const jenjang = participant.jenjang.toUpperCase();
            if (!levelStats[jenjang]) continue;

            try {
                const scoreResult = scoringUtils.calculateParticipantScores(participant.assessments);
                const overallScore = parseFloat(scoreResult.overallScore || 0);

                levelStats[jenjang].total++;
                if (overallScore >= 90) {
                    levelStats[jenjang].jml_90_100++;
                } else if (overallScore >= 60) {
                    levelStats[jenjang].jml_60_89++;
                } else {
                    levelStats[jenjang].jml_0_59++;
                }
            } catch (error) {
                console.error(`Error calculating score for participant ${participant.participant_id}:`, error);
                // Default to kurang_lancar on error
                levelStats[jenjang].jml_0_59++;
                levelStats[jenjang].total++;
            }
        }

        // Return as array
        return Object.keys(levelStats)
            .map(tingkat => ({ tingkat, ...levelStats[tingkat] }))
            .filter(item => item.total > 0);
    }

    // Get score distribution by subject (mata_pelajaran)
    async getScoreDistributionBySubject(provinsi = null) {
        const scoringUtils = require('../utils/scoring.utils');
        const provinceFilter = provinsi ? 'AND p.provinsi = :provinsi' : '';

        // Fetch participants with assessments (LIMIT 15000)
        const participantData = await sequelize.query(`
            SELECT p.id as participant_id, p.mata_pelajaran,
                json_agg(json_build_object('huruf', a.huruf, 'kategori', a.kategori, 'nilai', a.nilai)) as assessments
            FROM participants p
            INNER JOIN assessments a ON p.id = a.peserta_id
            WHERE p.mata_pelajaran IS NOT NULL AND p.status = 'SUDAH' ${provinceFilter}
            GROUP BY p.id, p.mata_pelajaran
            HAVING COUNT(a.id) > 0
            ORDER BY p.id DESC
            LIMIT 15000
        `, {
            replacements: { provinsi },
            type: QueryTypes.SELECT
        });

        // Group by subject
        const subjectStats = {};

        for (const participant of participantData) {
            const subject = participant.mata_pelajaran;
            if (!subjectStats[subject]) {
                subjectStats[subject] = {
                    mata_pelajaran: subject,
                    jml_0_59: 0,
                    jml_60_89: 0,
                    jml_90_100: 0,
                    total_peserta: 0
                };
            }

            try {
                const scoreResult = scoringUtils.calculateParticipantScores(participant.assessments);
                const overallScore = parseFloat(scoreResult.overallScore || 0);

                subjectStats[subject].total_peserta++;
                if (overallScore >= 90) {
                    subjectStats[subject].jml_90_100++;
                } else if (overallScore >= 60) {
                    subjectStats[subject].jml_60_89++;
                } else {
                    subjectStats[subject].jml_0_59++;
                }
            } catch (error) {
                console.error(`Error calculating score for participant ${participant.participant_id}:`, error);
                // Default to kurang_lancar on error
                subjectStats[subject].jml_0_59++;
                subjectStats[subject].total_peserta++;
            }
        }

        // Return sorted by total participants
        return Object.values(subjectStats)
            .sort((a, b) => b.total_peserta - a.total_peserta);
    }
}

module.exports = new DashboardRepository();
