-- ============================================================================
-- CHECK DASHBOARD INDEXES
-- Quick script to verify which indexes are installed vs missing
-- ============================================================================

-- 1. Show all existing dashboard indexes
SELECT
    '=== INSTALLED INDEXES ===' as section,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexname::regclass)) as size,
    pg_get_indexdef(indexname::regclass) as definition
FROM pg_indexes
WHERE tablename IN ('participants', 'assessments')
    AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- 2. Check which required indexes are MISSING
WITH required_indexes AS (
    SELECT unnest(ARRAY[
        'idx_participants_provinsi',
        'idx_participants_jenjang',
        'idx_participants_jenis_kelamin',
        'idx_participants_jenis_pt',
        'idx_participants_status_provinsi_completed',
        'idx_participants_status_jenjang_completed',
        'idx_participants_provinsi_covering',
        'idx_assessments_peserta_id',
        'idx_assessments_kategori_trgm',
        'idx_assessments_peserta_kategori',
        'idx_assessments_nilai_kategori',
        'idx_assessments_kategori_huruf'
    ]) as required_name
),
existing_indexes AS (
    SELECT indexname
    FROM pg_indexes
    WHERE tablename IN ('participants', 'assessments')
)
SELECT
    '=== INDEX STATUS ===' as section,
    r.required_name,
    CASE
        WHEN e.indexname IS NOT NULL THEN '✅ INSTALLED'
        ELSE '❌ MISSING - INSTALL THIS!'
    END as status,
    CASE
        WHEN r.required_name = 'idx_assessments_peserta_id' THEN '🔥 MOST CRITICAL - Install first!'
        WHEN r.required_name LIKE '%_completed' THEN '⭐ CRITICAL'
        WHEN r.required_name = 'idx_assessments_peserta_kategori' THEN '⭐ CRITICAL'
        ELSE 'Important'
    END as priority
FROM required_indexes r
LEFT JOIN existing_indexes e ON r.required_name = e.indexname
ORDER BY
    CASE
        WHEN e.indexname IS NULL THEN 0  -- Missing first
        ELSE 1
    END,
    CASE
        WHEN r.required_name = 'idx_assessments_peserta_id' THEN 1
        WHEN r.required_name LIKE '%_completed' THEN 2
        WHEN r.required_name = 'idx_assessments_peserta_kategori' THEN 3
        ELSE 4
    END;

-- 3. Summary count
SELECT
    '=== SUMMARY ===' as section,
    COUNT(*) FILTER (WHERE indexname LIKE 'idx_%') as installed_count,
    12 as required_count,
    12 - COUNT(*) FILTER (WHERE indexname LIKE 'idx_%') as missing_count
FROM pg_indexes
WHERE tablename IN ('participants', 'assessments');

-- 4. Check if pg_trgm extension is installed (required for kategori search)
SELECT
    '=== EXTENSION CHECK ===' as section,
    CASE
        WHEN COUNT(*) > 0 THEN '✅ pg_trgm extension installed'
        ELSE '❌ pg_trgm extension MISSING - run: CREATE EXTENSION pg_trgm;'
    END as status
FROM pg_extension
WHERE extname = 'pg_trgm';

-- 5. Table statistics
SELECT
    '=== TABLE SIZES ===' as section,
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as indexes_size
FROM pg_tables
WHERE tablename IN ('participants', 'assessments');

-- 6. Row counts
SELECT
    '=== ROW COUNTS ===' as section,
    'participants' as table_name,
    COUNT(*) as total_rows,
    COUNT(*) FILTER (WHERE status = 'SUDAH') as completed_rows
FROM participants
UNION ALL
SELECT
    '=== ROW COUNTS ===' as section,
    'assessments' as table_name,
    COUNT(*) as total_rows,
    NULL as completed_rows
FROM assessments;
