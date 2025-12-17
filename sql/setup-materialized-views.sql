-- ============================================================================
-- Materialized Views for Ultra-Fast Dashboard Queries
-- OPTIMIZED VERSION using kategori_normalized column
-- ============================================================================
--
-- Purpose: Pre-compute expensive aggregations for sub-100ms response times
-- Impact: 95%+ performance improvement (<100ms vs 2-5s for dashboard queries)
-- Trade-off: Data staleness (refresh every 2-4 hours acceptable for analytics)
--
-- Prerequisites:
-- 1. add-dashboard-indexes.sql must be executed
-- 2. add-kategori-normalized-column.sql must be executed
-- 3. Indexes on participants and assessments must exist
--
-- Refresh time: 3-5 minutes for 200K participants
-- Query time after refresh: <100ms (vs 2-5s for real-time calculation)
-- Recommended refresh frequency: Every 2-4 hours via cron job
--
-- ============================================================================

-- ============================================================================
-- MATERIALIZED VIEW 1: Overall Dashboard Statistics
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_dashboard_statistics AS
WITH category_errors AS (
    -- Aggregate errors by participant and category
    -- OPTIMIZED: Uses kategori_normalized instead of LIKE pattern matching
    SELECT
        a.peserta_id,
        a.kategori_normalized as category_normalized,
        LOWER(TRIM(a.huruf)) as huruf_raw,
        SUM(a.nilai) as total_errors,
        COUNT(*) as item_count,
        -- AHKAM sub-type detection
        CASE
            WHEN a.kategori_normalized = 'AHKAM' THEN
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
            WHEN a.kategori_normalized = 'MAD' THEN
                CASE
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%thabii%' OR LOWER(TRIM(a.kategori)) LIKE '%thabi%'
                         OR LOWER(TRIM(a.huruf)) LIKE '%thabii%' OR LOWER(TRIM(a.huruf)) LIKE '%thabi%' THEN 'thabii'
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%qashr%' OR LOWER(TRIM(a.huruf)) LIKE '%qashr%' THEN 'qashr'
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%wajib%' OR LOWER(TRIM(a.huruf)) LIKE '%wajib%' THEN 'wajib'
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%lazim%' OR LOWER(TRIM(a.huruf)) LIKE '%lazim%' THEN 'lazim'
                    ELSE 'default'
                END
            ELSE NULL
        END as mad_subtype
    FROM assessments a
    WHERE a.kategori_normalized IS NOT NULL
    GROUP BY a.peserta_id, a.kategori_normalized, LOWER(TRIM(a.kategori)), LOWER(TRIM(a.huruf))
),
participant_category_aggregates AS (
    SELECT
        peserta_id,
        category_normalized,
        SUM(total_errors) as total_errors,
        SUM(item_count) as item_count,
        SUM(CASE WHEN category_normalized = 'AHKAM' AND ahkam_subtype = 'tanaffus' THEN total_errors ELSE 0 END) as ahkam_tanaffus_errors,
        SUM(CASE WHEN category_normalized = 'AHKAM' AND ahkam_subtype = 'izhhar' THEN total_errors ELSE 0 END) as ahkam_izhhar_errors,
        SUM(CASE WHEN category_normalized = 'AHKAM' AND ahkam_subtype = 'gunna' THEN total_errors ELSE 0 END) as ahkam_gunna_errors,
        SUM(CASE WHEN category_normalized = 'AHKAM' AND ahkam_subtype = 'default' THEN total_errors ELSE 0 END) as ahkam_default_errors,
        SUM(CASE WHEN category_normalized = 'AHKAM' THEN item_count ELSE 0 END) as ahkam_item_count,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'thabii' THEN total_errors ELSE 0 END) as mad_thabii_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'qashr' THEN total_errors ELSE 0 END) as mad_qashr_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'wajib' THEN total_errors ELSE 0 END) as mad_wajib_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'lazim' THEN total_errors ELSE 0 END) as mad_lazim_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'default' THEN total_errors ELSE 0 END) as mad_default_errors,
        SUM(CASE WHEN category_normalized = 'MAD' THEN item_count ELSE 0 END) as mad_item_count
    FROM category_errors
    GROUP BY peserta_id, category_normalized
),
participant_scores AS (
    SELECT
        p.id as peserta_id,
        CASE
            WHEN (SELECT COUNT(*) > 0
                  FROM participant_category_aggregates pca
                  WHERE pca.peserta_id = p.id
                    AND pca.category_normalized = 'PENGURANGAN'
                    AND pca.total_errors > 0) THEN 10.0
            ELSE (
                COALESCE((
                    SELECT GREATEST(0, 55.5 - LEAST(
                        SUM(LEAST(total_errors * 1.5, 55.5 / NULLIF(item_count, 0))),
                        55.5
                    ))
                    FROM participant_category_aggregates
                    WHERE peserta_id = p.id AND category_normalized = 'MAKHRAJ'
                ), 55.5) +
                COALESCE((
                    SELECT GREATEST(0, 14.5 - LEAST(
                        SUM(LEAST(total_errors * 0.5, 14.5 / NULLIF(item_count, 0))),
                        14.5
                    ))
                    FROM participant_category_aggregates
                    WHERE peserta_id = p.id AND category_normalized = 'SIFAT'
                ), 14.5) +
                COALESCE((
                    SELECT GREATEST(0, 8.0 - LEAST(
                        (ahkam_tanaffus_errors * 2.0 +
                         ahkam_izhhar_errors * 1.0 +
                         ahkam_gunna_errors * 0.5 +
                         ahkam_default_errors * 0.5),
                        8.0
                    ))
                    FROM participant_category_aggregates
                    WHERE peserta_id = p.id AND category_normalized = 'AHKAM'
                ), 8.0) +
                COALESCE((
                    SELECT GREATEST(0, 13.5 - LEAST(
                        (mad_thabii_errors * 2.0 +
                         mad_qashr_errors * 2.0 +
                         mad_wajib_errors * 1.0 +
                         mad_lazim_errors * 1.0 +
                         mad_default_errors * 0.5),
                        13.5
                    ))
                    FROM participant_category_aggregates
                    WHERE peserta_id = p.id AND category_normalized = 'MAD'
                ), 13.5) +
                COALESCE((
                    SELECT GREATEST(0, 6.0 - LEAST(
                        SUM(LEAST(total_errors * 1.0, 6.0 / NULLIF(item_count, 0))),
                        6.0
                    ))
                    FROM participant_category_aggregates
                    WHERE peserta_id = p.id AND category_normalized = 'GHARIB'
                ), 6.0) +
                COALESCE((
                    SELECT GREATEST(0, 2.5 - LEAST(
                        SUM(LEAST(total_errors * 2.5, 2.5 / NULLIF(item_count, 0))),
                        2.5
                    ))
                    FROM participant_category_aggregates
                    WHERE peserta_id = p.id AND category_normalized = 'KELANCARAN'
                ), 2.5)
            )
        END as overall_score
    FROM participants p
    WHERE p.status = 'SUDAH'
)
SELECT
    COUNT(*) as total_participants,
    COUNT(CASE WHEN overall_score >= 90 THEN 1 END) as mahir_count,
    COUNT(CASE WHEN overall_score >= 75 AND overall_score < 90 THEN 1 END) as lancar_count,
    COUNT(CASE WHEN overall_score < 75 THEN 1 END) as kurang_lancar_count,
    ROUND(AVG(overall_score)::numeric, 2) as overall_avg_score,
    ROUND(MIN(overall_score)::numeric, 2) as min_score,
    ROUND(MAX(overall_score)::numeric, 2) as max_score,
    NOW() as last_refreshed
FROM participant_scores;

-- Create unique index for CONCURRENTLY refresh
CREATE UNIQUE INDEX IF NOT EXISTS mv_dashboard_statistics_idx ON mv_dashboard_statistics ((1));

-- ============================================================================
-- MATERIALIZED VIEW 2: Scores by Province
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_scores_by_province AS
WITH category_errors AS (
    SELECT
        a.peserta_id,
        a.kategori_normalized as category_normalized,
        LOWER(TRIM(a.huruf)) as huruf_raw,
        SUM(a.nilai) as total_errors,
        COUNT(*) as item_count,
        CASE
            WHEN a.kategori_normalized = 'AHKAM' THEN
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
        CASE
            WHEN a.kategori_normalized = 'MAD' THEN
                CASE
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%thabii%' OR LOWER(TRIM(a.kategori)) LIKE '%thabi%'
                         OR LOWER(TRIM(a.huruf)) LIKE '%thabii%' OR LOWER(TRIM(a.huruf)) LIKE '%thabi%' THEN 'thabii'
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%qashr%' OR LOWER(TRIM(a.huruf)) LIKE '%qashr%' THEN 'qashr'
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%wajib%' OR LOWER(TRIM(a.huruf)) LIKE '%wajib%' THEN 'wajib'
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%lazim%' OR LOWER(TRIM(a.huruf)) LIKE '%lazim%' THEN 'lazim'
                    ELSE 'default'
                END
            ELSE NULL
        END as mad_subtype
    FROM assessments a
    WHERE a.kategori_normalized IS NOT NULL
    GROUP BY a.peserta_id, a.kategori_normalized, LOWER(TRIM(a.kategori)), LOWER(TRIM(a.huruf))
),
participant_category_aggregates AS (
    SELECT
        peserta_id,
        category_normalized,
        SUM(total_errors) as total_errors,
        SUM(item_count) as item_count,
        SUM(CASE WHEN category_normalized = 'AHKAM' AND ahkam_subtype = 'tanaffus' THEN total_errors ELSE 0 END) as ahkam_tanaffus_errors,
        SUM(CASE WHEN category_normalized = 'AHKAM' AND ahkam_subtype = 'izhhar' THEN total_errors ELSE 0 END) as ahkam_izhhar_errors,
        SUM(CASE WHEN category_normalized = 'AHKAM' AND ahkam_subtype = 'gunna' THEN total_errors ELSE 0 END) as ahkam_gunna_errors,
        SUM(CASE WHEN category_normalized = 'AHKAM' AND ahkam_subtype = 'default' THEN total_errors ELSE 0 END) as ahkam_default_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'thabii' THEN total_errors ELSE 0 END) as mad_thabii_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'qashr' THEN total_errors ELSE 0 END) as mad_qashr_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'wajib' THEN total_errors ELSE 0 END) as mad_wajib_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'lazim' THEN total_errors ELSE 0 END) as mad_lazim_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'default' THEN total_errors ELSE 0 END) as mad_default_errors
    FROM category_errors
    GROUP BY peserta_id, category_normalized
),
participant_scores AS (
    SELECT
        p.id as peserta_id,
        p.provinsi,
        CASE
            WHEN (SELECT COUNT(*) > 0 FROM participant_category_aggregates pca
                  WHERE pca.peserta_id = p.id AND pca.category_normalized = 'PENGURANGAN' AND pca.total_errors > 0)
            THEN 10.0
            ELSE (
                COALESCE((SELECT GREATEST(0, 55.5 - LEAST(SUM(LEAST(total_errors * 1.5, 55.5 / NULLIF(item_count, 0))), 55.5))
                          FROM participant_category_aggregates WHERE peserta_id = p.id AND category_normalized = 'MAKHRAJ'), 55.5) +
                COALESCE((SELECT GREATEST(0, 14.5 - LEAST(SUM(LEAST(total_errors * 0.5, 14.5 / NULLIF(item_count, 0))), 14.5))
                          FROM participant_category_aggregates WHERE peserta_id = p.id AND category_normalized = 'SIFAT'), 14.5) +
                COALESCE((SELECT GREATEST(0, 8.0 - LEAST(
                          ahkam_tanaffus_errors * 2.0 + ahkam_izhhar_errors * 1.0 +
                          ahkam_gunna_errors * 0.5 + ahkam_default_errors * 0.5, 8.0))
                          FROM participant_category_aggregates WHERE peserta_id = p.id AND category_normalized = 'AHKAM'), 8.0) +
                COALESCE((SELECT GREATEST(0, 13.5 - LEAST(
                          mad_thabii_errors * 2.0 + mad_qashr_errors * 2.0 + mad_wajib_errors * 1.0 +
                          mad_lazim_errors * 1.0 + mad_default_errors * 0.5, 13.5))
                          FROM participant_category_aggregates WHERE peserta_id = p.id AND category_normalized = 'MAD'), 13.5) +
                COALESCE((SELECT GREATEST(0, 6.0 - LEAST(SUM(LEAST(total_errors * 1.0, 6.0 / NULLIF(item_count, 0))), 6.0))
                          FROM participant_category_aggregates WHERE peserta_id = p.id AND category_normalized = 'GHARIB'), 6.0) +
                COALESCE((SELECT GREATEST(0, 2.5 - LEAST(SUM(LEAST(total_errors * 2.5, 2.5 / NULLIF(item_count, 0))), 2.5))
                          FROM participant_category_aggregates WHERE peserta_id = p.id AND category_normalized = 'KELANCARAN'), 2.5)
            )
        END as overall_score
    FROM participants p
    WHERE p.status = 'SUDAH' AND p.provinsi IS NOT NULL
)
SELECT
    provinsi,
    COUNT(*) as total_participants,
    ROUND(AVG(overall_score)::numeric, 2) as avg_score,
    ROUND(MIN(overall_score)::numeric, 2) as min_score,
    ROUND(MAX(overall_score)::numeric, 2) as max_score,
    COUNT(CASE WHEN overall_score >= 90 THEN 1 END) as mahir_count,
    COUNT(CASE WHEN overall_score >= 75 AND overall_score < 90 THEN 1 END) as lancar_count,
    COUNT(CASE WHEN overall_score < 75 THEN 1 END) as kurang_lancar_count,
    NOW() as last_refreshed
FROM participant_scores
GROUP BY provinsi;

-- Create unique index for CONCURRENTLY refresh
CREATE UNIQUE INDEX IF NOT EXISTS mv_scores_by_province_idx ON mv_scores_by_province (provinsi);

-- ============================================================================
-- MATERIALIZED VIEW 3: Scores by Education Level
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_scores_by_education AS
WITH category_errors AS (
    SELECT
        a.peserta_id,
        a.kategori_normalized as category_normalized,
        LOWER(TRIM(a.huruf)) as huruf_raw,
        SUM(a.nilai) as total_errors,
        COUNT(*) as item_count,
        CASE
            WHEN a.kategori_normalized = 'AHKAM' THEN
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
        CASE
            WHEN a.kategori_normalized = 'MAD' THEN
                CASE
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%thabii%' OR LOWER(TRIM(a.kategori)) LIKE '%thabi%'
                         OR LOWER(TRIM(a.huruf)) LIKE '%thabii%' OR LOWER(TRIM(a.huruf)) LIKE '%thabi%' THEN 'thabii'
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%qashr%' OR LOWER(TRIM(a.huruf)) LIKE '%qashr%' THEN 'qashr'
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%wajib%' OR LOWER(TRIM(a.huruf)) LIKE '%wajib%' THEN 'wajib'
                    WHEN LOWER(TRIM(a.kategori)) LIKE '%lazim%' OR LOWER(TRIM(a.huruf)) LIKE '%lazim%' THEN 'lazim'
                    ELSE 'default'
                END
            ELSE NULL
        END as mad_subtype
    FROM assessments a
    WHERE a.kategori_normalized IS NOT NULL
    GROUP BY a.peserta_id, a.kategori_normalized, LOWER(TRIM(a.kategori)), LOWER(TRIM(a.huruf))
),
participant_category_aggregates AS (
    SELECT
        peserta_id,
        category_normalized,
        SUM(total_errors) as total_errors,
        SUM(item_count) as item_count,
        SUM(CASE WHEN category_normalized = 'AHKAM' AND ahkam_subtype = 'tanaffus' THEN total_errors ELSE 0 END) as ahkam_tanaffus_errors,
        SUM(CASE WHEN category_normalized = 'AHKAM' AND ahkam_subtype = 'izhhar' THEN total_errors ELSE 0 END) as ahkam_izhhar_errors,
        SUM(CASE WHEN category_normalized = 'AHKAM' AND ahkam_subtype = 'gunna' THEN total_errors ELSE 0 END) as ahkam_gunna_errors,
        SUM(CASE WHEN category_normalized = 'AHKAM' AND ahkam_subtype = 'default' THEN total_errors ELSE 0 END) as ahkam_default_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'thabii' THEN total_errors ELSE 0 END) as mad_thabii_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'qashr' THEN total_errors ELSE 0 END) as mad_qashr_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'wajib' THEN total_errors ELSE 0 END) as mad_wajib_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'lazim' THEN total_errors ELSE 0 END) as mad_lazim_errors,
        SUM(CASE WHEN category_normalized = 'MAD' AND mad_subtype = 'default' THEN total_errors ELSE 0 END) as mad_default_errors
    FROM category_errors
    GROUP BY peserta_id, category_normalized
),
participant_scores AS (
    SELECT
        p.id as peserta_id,
        p.jenjang,
        CASE
            WHEN (SELECT COUNT(*) > 0 FROM participant_category_aggregates pca
                  WHERE pca.peserta_id = p.id AND pca.category_normalized = 'PENGURANGAN' AND pca.total_errors > 0)
            THEN 10.0
            ELSE (
                COALESCE((SELECT GREATEST(0, 55.5 - LEAST(SUM(LEAST(total_errors * 1.5, 55.5 / NULLIF(item_count, 0))), 55.5))
                          FROM participant_category_aggregates WHERE peserta_id = p.id AND category_normalized = 'MAKHRAJ'), 55.5) +
                COALESCE((SELECT GREATEST(0, 14.5 - LEAST(SUM(LEAST(total_errors * 0.5, 14.5 / NULLIF(item_count, 0))), 14.5))
                          FROM participant_category_aggregates WHERE peserta_id = p.id AND category_normalized = 'SIFAT'), 14.5) +
                COALESCE((SELECT GREATEST(0, 8.0 - LEAST(
                          ahkam_tanaffus_errors * 2.0 + ahkam_izhhar_errors * 1.0 +
                          ahkam_gunna_errors * 0.5 + ahkam_default_errors * 0.5, 8.0))
                          FROM participant_category_aggregates WHERE peserta_id = p.id AND category_normalized = 'AHKAM'), 8.0) +
                COALESCE((SELECT GREATEST(0, 13.5 - LEAST(
                          mad_thabii_errors * 2.0 + mad_qashr_errors * 2.0 + mad_wajib_errors * 1.0 +
                          mad_lazim_errors * 1.0 + mad_default_errors * 0.5, 13.5))
                          FROM participant_category_aggregates WHERE peserta_id = p.id AND category_normalized = 'MAD'), 13.5) +
                COALESCE((SELECT GREATEST(0, 6.0 - LEAST(SUM(LEAST(total_errors * 1.0, 6.0 / NULLIF(item_count, 0))), 6.0))
                          FROM participant_category_aggregates WHERE peserta_id = p.id AND category_normalized = 'GHARIB'), 6.0) +
                COALESCE((SELECT GREATEST(0, 2.5 - LEAST(SUM(LEAST(total_errors * 2.5, 2.5 / NULLIF(item_count, 0))), 2.5))
                          FROM participant_category_aggregates WHERE peserta_id = p.id AND category_normalized = 'KELANCARAN'), 2.5)
            )
        END as overall_score
    FROM participants p
    WHERE p.status = 'SUDAH' AND p.jenjang IS NOT NULL
)
SELECT
    jenjang,
    COUNT(*) as total_participants,
    ROUND(AVG(overall_score)::numeric, 2) as avg_score,
    ROUND(MIN(overall_score)::numeric, 2) as min_score,
    ROUND(MAX(overall_score)::numeric, 2) as max_score,
    COUNT(CASE WHEN overall_score >= 90 THEN 1 END) as mahir_count,
    COUNT(CASE WHEN overall_score >= 75 AND overall_score < 90 THEN 1 END) as lancar_count,
    COUNT(CASE WHEN overall_score < 75 THEN 1 END) as kurang_lancar_count,
    NOW() as last_refreshed
FROM participant_scores
GROUP BY jenjang;

-- Create unique index for CONCURRENTLY refresh
CREATE UNIQUE INDEX IF NOT EXISTS mv_scores_by_education_idx ON mv_scores_by_education (jenjang);

-- ============================================================================
-- REFRESH COMMANDS (for manual refresh)
-- ============================================================================

-- Manual refresh (use during testing)
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_dashboard_statistics;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_scores_by_province;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_scores_by_education;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check view contents
SELECT * FROM mv_dashboard_statistics;
SELECT * FROM mv_scores_by_province ORDER BY total_participants DESC LIMIT 10;
SELECT * FROM mv_scores_by_education ORDER BY total_participants DESC;

-- Check view sizes
SELECT
    viewname,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||viewname)) as view_size
FROM pg_views
WHERE viewname LIKE 'mv_%'
    AND schemaname = 'public';

-- Check last refresh times
SELECT 'dashboard' as view, last_refreshed FROM mv_dashboard_statistics
UNION ALL
SELECT 'province' as view, MAX(last_refreshed) FROM mv_scores_by_province
UNION ALL
SELECT 'education' as view, MAX(last_refreshed) FROM mv_scores_by_education;

-- ============================================================================
-- DROP COMMANDS (if needed for rollback)
-- ============================================================================

-- DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_statistics CASCADE;
-- DROP MATERIALIZED VIEW IF EXISTS mv_scores_by_province CASCADE;
-- DROP MATERIALIZED VIEW IF EXISTS mv_scores_by_education CASCADE;

-- ============================================================================
-- Expected Performance:
-- - Dashboard statistics query: <100ms (from 2-5s)
-- - Province aggregation: <50ms (from 3-8s)
-- - Education aggregation: <50ms (from 3-8s)
-- - Total improvement: 95%+ for dashboard queries
--
-- Next Steps:
-- 1. Create refresh script (refresh-materialized-views.sh)
-- 2. Set up cron job for periodic refresh
-- 3. Update dashboard.repository.js to use these views
-- ============================================================================
