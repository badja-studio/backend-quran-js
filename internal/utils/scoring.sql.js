/**
 * SQL Scoring Helper
 *
 * Centralized SQL query generator for Quran assessment scoring calculations.
 * Translates the complex JavaScript scoring logic from scoring.utils.js into SQL.
 *
 * At 200K+ participant scale, calculating scores in JavaScript would require loading
 * all data into memory (causing OOM). This helper generates SQL queries that perform
 * all calculations in the database using CTEs and aggregations.
 *
 * Scoring Formula:
 * - 6 main categories: MAKHRAJ, SIFAT, AHKAM, MAD, GHARIB, KELANCARAN
 * - Each category has initial score and deduction rate per error
 * - Special case: PENGURANGAN penalty sets total score to 10
 * - AHKAM and MAD have sub-types with variable deduction rates
 * - Formula: category_score = MAX(0, initial - MIN(errors * rate, initial))
 * - Overall score = SUM of all category scores
 */

const SCORING_RULES = {
    MAKHRAJ: { initial: 55.5, deduction: 1.5 },
    SIFAT: { initial: 14.5, deduction: 0.5 },
    AHKAM: {
        initial: 8,
        subTypes: {
            tanaffus: 2.0,
            izhhar: 1.0,
            gunna: 0.5,
            default: 0.5
        }
    },
    MAD: {
        initial: 13.5,
        subTypes: {
            thabii: 2.0,
            qashr: 2.0,
            wajib: 1.0,
            lazim: 1.0,
            default: 0.5
        }
    },
    GHARIB: { initial: 6, deduction: 1.0 },
    KELANCARAN: { initial: 2.5, deduction: 2.5 }
};

class ScoringSQLHelper {
    /**
     * Build SQL CTE (Common Table Expression) for participant scores
     * This is the core CTE used by all dashboard queries
     *
     * @param {Object} options - Configuration options
     * @param {boolean} options.includeParticipantId - Include participant ID in output
     * @param {boolean} options.filterByStatus - Filter by status = 'SUDAH'
     * @returns {string} SQL CTE string
     */
    static buildParticipantScoresCTE(options = {}) {
        const {
            includeParticipantId = true,
            filterByStatus = true
        } = options;

        return `
WITH category_errors AS (
    -- Aggregate errors by participant and category
    -- Normalize kategori to handle variations in naming
    SELECT
        a.peserta_id,
        LOWER(TRIM(a.kategori)) as kategori_raw,
        LOWER(TRIM(a.huruf)) as huruf_raw,
        SUM(a.nilai) as total_errors,
        COUNT(*) as item_count,
        -- Category normalization
        CASE
            WHEN LOWER(TRIM(a.kategori)) LIKE '%makhraj%' THEN 'MAKHRAJ'
            WHEN LOWER(TRIM(a.kategori)) LIKE '%sifat%' OR LOWER(TRIM(a.kategori)) LIKE '%shifat%' THEN 'SIFAT'
            WHEN LOWER(TRIM(a.kategori)) LIKE '%ahkam%' AND LOWER(TRIM(a.kategori)) NOT LIKE '%mad%' THEN 'AHKAM'
            WHEN LOWER(TRIM(a.kategori)) LIKE '%mad%' THEN 'MAD'
            WHEN LOWER(TRIM(a.kategori)) LIKE '%gharib%' OR LOWER(TRIM(a.kategori)) LIKE '%badal%' THEN 'GHARIB'
            WHEN LOWER(TRIM(a.kategori)) LIKE '%kelancaran%' OR LOWER(TRIM(a.kategori)) LIKE '%lancar%' THEN 'KELANCARAN'
            WHEN LOWER(TRIM(a.kategori)) LIKE '%pengurangan%' OR LOWER(TRIM(a.kategori)) LIKE '%tidak bisa%' THEN 'PENGURANGAN'
            ELSE 'OTHER'
        END as category_normalized,
        -- AHKAM sub-type detection
        CASE
            WHEN LOWER(TRIM(a.kategori)) LIKE '%ahkam%' OR LOWER(TRIM(a.kategori)) LIKE '%tanaffus%' OR LOWER(TRIM(a.kategori)) LIKE '%izhhar%' OR LOWER(TRIM(a.kategori)) LIKE '%gunna%' THEN
                CASE
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%tanaffus%' OR LOWER(TRIM(a.huruf)) LIKE '%tanaffus%' THEN 'tanaffus'
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%izhhar%' OR LOWER(TRIM(a.kategori)) LIKE '%izhar%'
                         OR LOWER(TRIM(a.huruf)) LIKE '%izhhar%' OR LOWER(TRIM(a.huruf)) LIKE '%izhar%' THEN 'izhhar'
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%gunna%' OR LOWER(TRIM(a.kategori)) LIKE '%ghunna%'
                         OR LOWER(TRIM(a.huruf)) LIKE '%gunna%' OR LOWER(TRIM(a.huruf)) LIKE '%ghunna%' THEN 'gunna'
                    ELSE 'default'
                END
            ELSE NULL
        END as ahkam_subtype,
        -- MAD sub-type detection
        CASE
            WHEN LOWER(TRIM(a.kategori)) LIKE '%mad%' OR LOWER(TRIM(a.kategori)) LIKE '%qashr%' THEN
                CASE
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%thabii%' OR LOWER(TRIM(a.kategori)) LIKE '%thabi%'
                         OR LOWER(TRIM(a.huruf)) LIKE '%thabii%' OR LOWER(TRIM(a.huruf)) LIKE '%thabi%' THEN 'thabii'
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%qashr%' OR LOWER(TRIM(a.huruf)) LIKE '%qashr%' THEN 'qashr'
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%wajib%' OR LOWER(TRIM(a.huruf)) LIKE '%wajib%' THEN 'wajib'
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%lazim%' OR LOWER(TRIM(a.huruf)) LIKE '%lazim%' THEN 'lazim'
                    ELSE 'default'
                END
            ELSE NULL
        END as mad_subtype,
        -- PENGURANGAN type detection with granular deductions
        CASE
            WHEN LOWER(TRIM(a.kategori)) LIKE '%pengurangan%' OR LOWER(TRIM(a.kategori)) LIKE '%tidak bisa%' THEN
                CASE
                    WHEN LOWER(TRIM(a.huruf)) LIKE '%tidak bisa membaca%' THEN 90
                    WHEN LOWER(TRIM(a.huruf)) LIKE '%suara tidak ada%' THEN 100
                    WHEN LOWER(TRIM(a.huruf)) LIKE '%video rusak%' THEN 100
                    WHEN LOWER(TRIM(a.huruf)) LIKE '%terindikasi dubbing%' THEN 100
                    WHEN LOWER(TRIM(a.huruf)) LIKE '%video tidak ada gambar%' THEN 0
                    WHEN LOWER(TRIM(a.huruf)) LIKE '%ayat%tidak sesuai%' THEN 0
                    WHEN LOWER(TRIM(a.huruf)) LIKE '%maqro%tidak sesuai%' THEN 100
                    WHEN LOWER(TRIM(a.huruf)) LIKE '%maqro%sebagian%' THEN 50
                    ELSE 90
                END
            ELSE NULL
        END as pengurangan_deduction
    FROM assessments a
    GROUP BY a.peserta_id, LOWER(TRIM(a.kategori)), LOWER(TRIM(a.huruf))
),
participant_category_aggregates AS (
    -- Aggregate by participant and normalized category
    SELECT
        peserta_id,
        category_normalized,
        SUM(total_errors) as total_errors,
        SUM(item_count) as item_count,
        -- For AHKAM: aggregate errors by sub-type
        SUM(CASE WHEN category_normalized = 'AHKAM' AND ahkam_subtype = 'tanaffus' THEN total_errors ELSE 0 END) as ahkam_tanaffus_errors,
        SUM(CASE WHEN category_normalized = 'AHKAM' AND ahkam_subtype = 'izhhar' THEN total_errors ELSE 0 END) as ahkam_izhhar_errors,
        SUM(CASE WHEN category_normalized = 'AHKAM' AND ahkam_subtype = 'gunna' THEN total_errors ELSE 0 END) as ahkam_gunna_errors,
        SUM(CASE WHEN category_normalized = 'AHKAM' AND ahkam_subtype = 'default' THEN total_errors ELSE 0 END) as ahkam_default_errors,
        SUM(CASE WHEN category_normalized = 'AHKAM' THEN item_count ELSE 0 END) as ahkam_item_count,
        -- For MAD: aggregate errors by sub-type
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'thabii' THEN total_errors ELSE 0 END) as mad_thabii_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'qashr' THEN total_errors ELSE 0 END) as mad_qashr_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'wajib' THEN total_errors ELSE 0 END) as mad_wajib_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'lazim' THEN total_errors ELSE 0 END) as mad_lazim_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'default' THEN total_errors ELSE 0 END) as mad_default_errors,
        SUM(CASE WHEN category_normalized = 'MAD' THEN item_count ELSE 0 END) as mad_item_count,
        -- For PENGURANGAN: track maximum deduction (most severe penalty wins)
        MAX(CASE WHEN category_normalized = 'PENGURANGAN' AND total_errors > 0 THEN pengurangan_deduction ELSE 0 END) as max_pengurangan_deduction
    FROM category_errors
    GROUP BY peserta_id, category_normalized
),
participant_scores AS (
    -- Calculate final scores for each participant
    SELECT
        p.id as peserta_id,
        -- Get maximum PENGURANGAN deduction (0, 50, 90, or 100)
        COALESCE((SELECT MAX(pca.max_pengurangan_deduction)
                  FROM participant_category_aggregates pca
                  WHERE pca.peserta_id = p.id
                    AND pca.category_normalized = 'PENGURANGAN'), 0) as max_pengurangan_deduction,
        -- Calculate score for each category
        ${this._buildCategoryScoreCalculation()}
    FROM participants p
    ${filterByStatus ? "WHERE p.status = 'SUDAH'" : ''}
)`;
    }

    /**
     * Build SQL for calculating scores per category with per-item fairness
     * @private
     */
    static _buildCategoryScoreCalculation() {
        return `
        -- Overall score calculation
        CASE
            -- PENGURANGAN penalty: override to score 10
            WHEN (SELECT COUNT(*) > 0
                  FROM participant_category_aggregates pca
                  WHERE pca.peserta_id = p.id
                    AND pca.category_normalized = 'PENGURANGAN'
                    AND pca.total_errors > 0) THEN 10.0
            ELSE (
                -- MAKHRAJ score calculation with per-item fairness
                COALESCE((
                    SELECT GREATEST(0, ${SCORING_RULES.MAKHRAJ.initial} - LEAST(
                        SUM(
                            LEAST(
                                total_errors * ${SCORING_RULES.MAKHRAJ.deduction},
                                ${SCORING_RULES.MAKHRAJ.initial} / NULLIF(item_count, 0)
                            )
                        ),
                        ${SCORING_RULES.MAKHRAJ.initial}
                    ))
                    FROM participant_category_aggregates
                    WHERE peserta_id = p.id AND category_normalized = 'MAKHRAJ'
                ), ${SCORING_RULES.MAKHRAJ.initial}) +

                -- SIFAT score calculation with per-item fairness
                COALESCE((
                    SELECT GREATEST(0, ${SCORING_RULES.SIFAT.initial} - LEAST(
                        SUM(
                            LEAST(
                                total_errors * ${SCORING_RULES.SIFAT.deduction},
                                ${SCORING_RULES.SIFAT.initial} / NULLIF(item_count, 0)
                            )
                        ),
                        ${SCORING_RULES.SIFAT.initial}
                    ))
                    FROM participant_category_aggregates
                    WHERE peserta_id = p.id AND category_normalized = 'SIFAT'
                ), ${SCORING_RULES.SIFAT.initial}) +

                -- AHKAM score calculation with sub-type penalties and per-item fairness
                COALESCE((
                    SELECT GREATEST(0, ${SCORING_RULES.AHKAM.initial} - LEAST(
                        (ahkam_tanaffus_errors * ${SCORING_RULES.AHKAM.subTypes.tanaffus} +
                         ahkam_izhhar_errors * ${SCORING_RULES.AHKAM.subTypes.izhhar} +
                         ahkam_gunna_errors * ${SCORING_RULES.AHKAM.subTypes.gunna} +
                         ahkam_default_errors * ${SCORING_RULES.AHKAM.subTypes.default}),
                        ${SCORING_RULES.AHKAM.initial}
                    ))
                    FROM participant_category_aggregates
                    WHERE peserta_id = p.id AND category_normalized = 'AHKAM'
                ), ${SCORING_RULES.AHKAM.initial}) +

                -- MAD score calculation with sub-type penalties and per-item fairness
                COALESCE((
                    SELECT GREATEST(0, ${SCORING_RULES.MAD.initial} - LEAST(
                        (mad_thabii_errors * ${SCORING_RULES.MAD.subTypes.thabii} +
                         mad_qashr_errors * ${SCORING_RULES.MAD.subTypes.qashr} +
                         mad_wajib_errors * ${SCORING_RULES.MAD.subTypes.wajib} +
                         mad_lazim_errors * ${SCORING_RULES.MAD.subTypes.lazim} +
                         mad_default_errors * ${SCORING_RULES.MAD.subTypes.default}),
                        ${SCORING_RULES.MAD.initial}
                    ))
                    FROM participant_category_aggregates
                    WHERE peserta_id = p.id AND category_normalized = 'MAD'
                ), ${SCORING_RULES.MAD.initial}) +

                -- GHARIB score calculation with per-item fairness
                COALESCE((
                    SELECT GREATEST(0, ${SCORING_RULES.GHARIB.initial} - LEAST(
                        SUM(
                            LEAST(
                                total_errors * ${SCORING_RULES.GHARIB.deduction},
                                ${SCORING_RULES.GHARIB.initial} / NULLIF(item_count, 0)
                            )
                        ),
                        ${SCORING_RULES.GHARIB.initial}
                    ))
                    FROM participant_category_aggregates
                    WHERE peserta_id = p.id AND category_normalized = 'GHARIB'
                ), ${SCORING_RULES.GHARIB.initial}) +

                -- KELANCARAN score calculation with per-item fairness
                COALESCE((
                    SELECT GREATEST(0, ${SCORING_RULES.KELANCARAN.initial} - LEAST(
                        SUM(
                            LEAST(
                                total_errors * ${SCORING_RULES.KELANCARAN.deduction},
                                ${SCORING_RULES.KELANCARAN.initial} / NULLIF(item_count, 0)
                            )
                        ),
                        ${SCORING_RULES.KELANCARAN.initial}
                    ))
                    FROM participant_category_aggregates
                    WHERE peserta_id = p.id AND category_normalized = 'KELANCARAN'
                ), ${SCORING_RULES.KELANCARAN.initial})
            )
        END as overall_score`;
    }

    /**
     * Get query for overall average score
     * Used by: getBasicStatistics()
     *
     * @returns {string} Complete SQL query
     */
    static getAverageScoreQuery() {
        return `
${this.buildParticipantScoresCTE()}
SELECT
    ROUND(AVG(overall_score)::numeric, 2) as avg_score,
    COUNT(*) as participant_count
FROM participant_scores;
        `;
    }

    /**
     * Get query for scores grouped by education level
     * Used by: getAverageScoresByEducationLevel()
     *
     * @returns {string} Complete SQL query
     */
    static getScoresByEducationQuery() {
        return `
${this.buildParticipantScoresCTE()}
SELECT
    p.jenjang,
    ROUND(AVG(ps.overall_score)::numeric, 2) as avg_score,
    COUNT(*) as participant_count,
    ROUND(MIN(ps.overall_score)::numeric, 2) as min_score,
    ROUND(MAX(ps.overall_score)::numeric, 2) as max_score
FROM participant_scores ps
JOIN participants p ON p.id = ps.peserta_id
WHERE p.jenjang IS NOT NULL
GROUP BY p.jenjang
ORDER BY p.jenjang;
        `;
    }

    /**
     * Get query for scores grouped by province
     * Used by: getProvinceAchievementData()
     *
     * @returns {string} Complete SQL query
     */
    static getScoresByProvinceQuery() {
        return `
${this.buildParticipantScoresCTE()}
SELECT
    p.provinsi as name,
    ROUND(MIN(ps.overall_score)::numeric, 2) as terendah,
    ROUND(MAX(ps.overall_score)::numeric, 2) as tertinggi,
    ROUND(AVG(ps.overall_score)::numeric, 2) as rata,
    COUNT(*) as participant_count
FROM participant_scores ps
JOIN participants p ON p.id = ps.peserta_id
WHERE p.provinsi IS NOT NULL
GROUP BY p.provinsi
ORDER BY p.provinsi;
        `;
    }

    /**
     * Get query for fluency levels by province
     * Used by: getFluencyLevelByProvince()
     *
     * @returns {string} Complete SQL query
     */
    static getFluencyByProvinceQuery() {
        return `
${this.buildParticipantScoresCTE()}
,
fluency_categorized AS (
    SELECT
        p.provinsi,
        COUNT(*) as total,
        COUNT(CASE WHEN ps.overall_score >= 90 THEN 1 END) as mahir,
        COUNT(CASE WHEN ps.overall_score >= 75 AND ps.overall_score < 90 THEN 1 END) as lancar,
        COUNT(CASE WHEN ps.overall_score < 75 THEN 1 END) as kurang_lancar
    FROM participant_scores ps
    JOIN participants p ON p.id = ps.peserta_id
    WHERE p.provinsi IS NOT NULL
    GROUP BY p.provinsi
)
SELECT
    provinsi as name,
    ROUND((mahir * 100.0 / NULLIF(total, 0))::numeric, 2) as mahir,
    ROUND((lancar * 100.0 / NULLIF(total, 0))::numeric, 2) as lancar,
    ROUND((kurang_lancar * 100.0 / NULLIF(total, 0))::numeric, 2) as kurang_lancar
FROM fluency_categorized
ORDER BY provinsi;
        `;
    }

    /**
     * Get query for participant scores with details
     * Used for validation and testing
     *
     * @param {number} limit - Number of participants to return
     * @returns {string} Complete SQL query
     */
    static getParticipantScoresDetailQuery(limit = 100) {
        return `
${this.buildParticipantScoresCTE({ includeParticipantId: true })}
SELECT
    p.id,
    p.nama,
    p.provinsi,
    p.jenjang,
    p.status,
    ps.overall_score,
    ps.has_pengurangan
FROM participant_scores ps
JOIN participants p ON p.id = ps.peserta_id
ORDER BY p.id
LIMIT ${limit};
        `;
    }
}

module.exports = ScoringSQLHelper;
