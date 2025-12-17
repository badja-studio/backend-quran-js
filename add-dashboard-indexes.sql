-- ============================================================================
-- Dashboard Performance Indexes
-- Manual SQL Script for 200K+ Participants Scale
-- ============================================================================
--
-- Purpose: Add critical indexes to optimize dashboard queries
-- Impact: 60-80% immediate performance improvement, prevents query timeouts
-- Execution time: 10-20 minutes for 200K participants + 1M assessments
--
-- Instructions:
-- 1. Run during low-traffic period (recommended: 2-4 AM)
-- 2. Monitor progress: SELECT * FROM pg_stat_progress_create_index;
-- 3. After completion, run: ANALYZE participants; ANALYZE assessments;
--
-- ============================================================================

-- Enable pg_trgm extension for trigram-based text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- PARTICIPANTS TABLE INDEXES
-- ============================================================================

-- 1. Single column index on provinsi (used in province aggregations)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_provinsi
ON participants(provinsi)
WHERE provinsi IS NOT NULL;

-- 2. Single column index on jenjang (used in education level grouping)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_jenjang
ON participants(jenjang)
WHERE jenjang IS NOT NULL;

-- 3. Single column index on jenis_kelamin (used in gender distribution)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_jenis_kelamin
ON participants(jenis_kelamin)
WHERE jenis_kelamin IS NOT NULL;

-- 4. Single column index on jenis_pt (used in institution type distribution)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_jenis_pt
ON participants(jenis_pt)
WHERE jenis_pt IS NOT NULL;

-- 5. CRITICAL: Partial composite index on (status, provinsi) for completed participants
--    This is a PARTIAL INDEX - only indexes WHERE status = 'SUDAH'
--    Reduces index size by 50%+ and improves query speed significantly
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_status_provinsi_completed
ON participants(status, provinsi)
WHERE status = 'SUDAH' AND provinsi IS NOT NULL;

-- 6. CRITICAL: Partial composite index on (status, jenjang) for completed participants
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_status_jenjang_completed
ON participants(status, jenjang)
WHERE status = 'SUDAH' AND jenjang IS NOT NULL;

-- 7. Covering index on provinsi with included columns for index-only scans
--    This allows PostgreSQL to answer queries without touching the table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_provinsi_covering
ON participants(provinsi) INCLUDE (jenjang, status, jenis_kelamin)
WHERE provinsi IS NOT NULL;

-- ============================================================================
-- ASSESSMENTS TABLE INDEXES
-- ============================================================================

-- 8. MOST CRITICAL: Index on peserta_id (currently MISSING!)
--    Without this, every JOIN causes a full table scan on 1M+ assessments (30+ second queries)
--    This is the #1 priority index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_peserta_id
ON assessments(peserta_id);

-- 9. Index on kategori with trigram for ILIKE queries
--    Uses pg_trgm extension for pattern matching like '%makhraj%'
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_kategori_trgm
ON assessments USING gin (kategori gin_trgm_ops);

-- 10. CRITICAL: Composite index on (peserta_id, kategori) for scoring aggregations
--     Enables index-only scans for error category aggregations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_peserta_kategori
ON assessments(peserta_id, kategori);

-- 11. Composite index on (nilai, kategori) for error statistics
--     Used in queries filtering by nilai < 100 and grouping by kategori
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_nilai_kategori
ON assessments(nilai, kategori)
WHERE nilai < 100;

-- 12. Composite index on (kategori, huruf) for error breakdown by letter
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_kategori_huruf
ON assessments(kategori, huruf);

-- ============================================================================
-- Update statistics after creating indexes
-- ============================================================================

ANALYZE participants;
ANALYZE assessments;

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Check that all indexes were created successfully
SELECT
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexname::regclass)) as index_size
FROM pg_indexes
WHERE tablename IN ('participants', 'assessments')
    AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- ============================================================================
-- Expected Results:
-- - Dashboard queries: 60-80% faster
-- - Query timeouts: Should be eliminated
-- - With upcoming SQL optimization: 90-95% total improvement
-- ============================================================================
