-- ============================================================================
-- Additional Performance Indexes
-- Complementary to add-dashboard-indexes.sql
-- ============================================================================
--
-- Purpose: Add supplementary indexes for improved query performance
-- Prerequisites: add-dashboard-indexes.sql must be executed first
-- Execution time: 5-10 minutes for 200K participants + 1M assessments
--
-- Instructions:
-- 1. Verify prerequisites are met (check existing indexes)
-- 2. Run during low-traffic period (recommended: 2-4 AM)
-- 3. Monitor progress: SELECT * FROM pg_stat_progress_create_index;
-- 4. After completion, run: ANALYZE participants; ANALYZE assessments;
--
-- ============================================================================

-- ============================================================================
-- PARTICIPANTS TABLE - Additional Indexes
-- ============================================================================

-- Composite index for participant listing with pagination (ordered by creation date)
-- Use case: Recent participants, filtered by status
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_status_created
ON participants(status, "createdAt" DESC)
WHERE status IS NOT NULL;

-- Composite index for assessor assignment queries
-- Use case: Find participants assigned to specific assessor, filtered by status
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_asesor_status
ON participants(asesor_id, status)
WHERE asesor_id IS NOT NULL;

-- Partial index for participants without assessor (ready for assignment)
-- Use case: Dashboard showing unassigned participants
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_no_asesor
ON participants(status, "createdAt" DESC)
WHERE asesor_id IS NULL;

-- Covering index for participant list with commonly displayed fields
-- Use case: Participant list queries that need nama, nip without table access
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_list_covering
ON participants(status, provinsi)
INCLUDE (nama, nip, jenjang, jenis_kelamin)
WHERE status = 'SUDAH';

-- ============================================================================
-- ASSESSMENTS TABLE - Additional Indexes
-- ============================================================================

-- Covering index for error statistics query (after kategori_normalized is added)
-- Use case: Error breakdown by category and huruf without table access
-- NOTE: This assumes kategori_normalized column exists (from migration)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_kategori_huruf_nilai
ON assessments(kategori_normalized, huruf)
INCLUDE (nilai, peserta_id)
WHERE nilai > 0;

-- Composite index for assessor assessment queries
-- Use case: Assessor viewing their assessments
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_asesor_created
ON assessments(asesor_id, "createdAt" DESC);

-- Partial index for high-error assessments (quality monitoring)
-- Use case: Identifying assessments with significant errors
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_high_errors
ON assessments(peserta_id, kategori_normalized, nilai)
WHERE nilai >= 10;

-- ============================================================================
-- ASSESSORS TABLE - Additional Indexes
-- ============================================================================

-- Index for assessor search by username (if not already exists)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessors_username_lower
ON assessors(LOWER(username));

-- Composite index for assessor workload queries
-- Use case: Finding assessors by participant count ranges
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessors_workload
ON assessors(total_peserta_belum_asesmen, total_peserta_selesai_asesmen)
WHERE total_peserta_belum_asesmen > 0 OR total_peserta_selesai_asesmen > 0;

-- ============================================================================
-- Update statistics after creating indexes
-- ============================================================================

ANALYZE participants;
ANALYZE assessments;
ANALYZE assessors;

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Check that all new indexes were created successfully
SELECT
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexname::regclass)) as index_size,
    idx_scan as times_used,
    idx_tup_read as tuples_read
FROM pg_indexes
LEFT JOIN pg_stat_user_indexes USING (schemaname, tablename, indexname)
WHERE tablename IN ('participants', 'assessments', 'assessors')
    AND indexname LIKE 'idx_%'
    AND schemaname = 'public'
ORDER BY tablename, indexname;

-- Check index usage after running for a while (run this query after 24 hours)
-- Identify unused indexes (idx_scan = 0)
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexname::regclass)) as index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
    AND idx_scan = 0
    AND indexname LIKE 'idx_%'
ORDER BY pg_relation_size(indexname::regclass) DESC;

-- ============================================================================
-- Expected Impact:
-- - Participant listing queries: 10-20% faster
-- - Assessor assignment queries: 30-40% faster
-- - Error statistics queries: 15-25% faster (with kategori_normalized)
-- - Index-only scans enabled for common query patterns
-- ============================================================================
