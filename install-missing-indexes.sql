-- ============================================================================
-- INSTALL MISSING DASHBOARD INDEXES
-- Run this file to install any indexes that are not yet created
-- ============================================================================
--
-- Usage:
--   psql -h localhost -U your_user -d your_database -f install-missing-indexes.sql
--
-- Or copy-paste ke psql prompt
--
-- Note: Uses "IF NOT EXISTS" so safe to run multiple times
-- ============================================================================

-- Enable pg_trgm extension for text search (required for kategori index)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- PARTICIPANTS TABLE INDEXES
-- ============================================================================

-- 1. Province index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_provinsi
ON participants(provinsi)
WHERE provinsi IS NOT NULL;

-- 2. Education level index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_jenjang
ON participants(jenjang)
WHERE jenjang IS NOT NULL;

-- 3. Gender index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_jenis_kelamin
ON participants(jenis_kelamin)
WHERE jenis_kelamin IS NOT NULL;

-- 4. Institution type index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_jenis_pt
ON participants(jenis_pt)
WHERE jenis_pt IS NOT NULL;

-- 5. 🔥 CRITICAL: Completed participants by province (partial index)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_status_provinsi_completed
ON participants(status, provinsi)
WHERE status = 'SUDAH' AND provinsi IS NOT NULL;

-- 6. 🔥 CRITICAL: Completed participants by education level (partial index)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_status_jenjang_completed
ON participants(status, jenjang)
WHERE status = 'SUDAH' AND jenjang IS NOT NULL;

-- 7. Covering index for index-only scans
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_participants_provinsi_covering
ON participants(provinsi) INCLUDE (jenjang, status, jenis_kelamin)
WHERE provinsi IS NOT NULL;

-- ============================================================================
-- ASSESSMENTS TABLE INDEXES
-- ============================================================================

-- 8. 🔥 MOST CRITICAL: Participant ID for JOINs
--    WITHOUT THIS INDEX = 30+ SECOND QUERIES!
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_peserta_id
ON assessments(peserta_id);

-- 9. Category search with trigram (for ILIKE queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_kategori_trgm
ON assessments USING gin (kategori gin_trgm_ops);

-- 10. 🔥 CRITICAL: Composite index for scoring aggregations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_peserta_kategori
ON assessments(peserta_id, kategori);

-- 11. Error statistics (nilai < 100)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_nilai_kategori
ON assessments(nilai, kategori)
WHERE nilai < 100;

-- 12. Error breakdown by letter
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_kategori_huruf
ON assessments(kategori, huruf);

-- ============================================================================
-- Update statistics after creating indexes
-- ============================================================================

ANALYZE participants;
ANALYZE assessments;

-- ============================================================================
-- Verification
-- ============================================================================

-- Show all created indexes
SELECT
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexname::regclass)) as size
FROM pg_indexes
WHERE tablename IN ('participants', 'assessments')
    AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- ============================================================================
-- Expected Result: 12 indexes total
-- ============================================================================
