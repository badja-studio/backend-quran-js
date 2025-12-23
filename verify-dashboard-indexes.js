/**
 * Verify Dashboard Performance Indexes
 *
 * This script checks if all required indexes are installed in the database
 * Run with: node verify-dashboard-indexes.js
 */

const { sequelize } = require('./config/database');

// List of all required indexes for dashboard performance
const REQUIRED_INDEXES = [
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
];

async function verifyIndexes() {
    try {
        console.log('🔍 Checking dashboard performance indexes...\n');

        // Query to get all indexes
        const [indexes] = await sequelize.query(`
            SELECT
                schemaname,
                tablename,
                indexname,
                pg_size_pretty(pg_relation_size(indexname::regclass)) as index_size
            FROM pg_indexes
            WHERE tablename IN ('participants', 'assessments')
                AND indexname LIKE 'idx_%'
            ORDER BY tablename, indexname
        `);

        console.log('📊 Installed Indexes:\n');
        console.log('Table'.padEnd(20), 'Index Name'.padEnd(45), 'Size');
        console.log('─'.repeat(80));

        const installedIndexNames = new Set();
        indexes.forEach(idx => {
            console.log(
                idx.tablename.padEnd(20),
                idx.indexname.padEnd(45),
                idx.index_size
            );
            installedIndexNames.add(idx.indexname);
        });

        console.log('\n✅ Index Status:\n');

        let allInstalled = true;
        REQUIRED_INDEXES.forEach(indexName => {
            const isInstalled = installedIndexNames.has(indexName);
            const status = isInstalled ? '✅' : '❌';
            console.log(`${status} ${indexName}`);
            if (!isInstalled) {
                allInstalled = false;
            }
        });

        console.log('\n');

        if (allInstalled) {
            console.log('✅ All required indexes are installed!');
            console.log('📈 Your dashboard queries should be optimized.\n');
        } else {
            console.log('⚠️  Some indexes are missing!');
            console.log('📝 Please run: psql -h HOST -U USER -d DB -f add-dashboard-indexes.sql');
            console.log('   Or check the install-missing-indexes.sql file\n');
        }

        // Check for pg_trgm extension
        const [extensions] = await sequelize.query(`
            SELECT extname FROM pg_extension WHERE extname = 'pg_trgm'
        `);

        if (extensions.length > 0) {
            console.log('✅ pg_trgm extension is installed\n');
        } else {
            console.log('⚠️  pg_trgm extension is NOT installed');
            console.log('   Run: CREATE EXTENSION IF NOT EXISTS pg_trgm;\n');
        }

        // Get table statistics
        const [tableStats] = await sequelize.query(`
            SELECT
                schemaname,
                tablename,
                pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
                pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
                pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) AS indexes_size
            FROM pg_tables
            WHERE tablename IN ('participants', 'assessments')
        `);

        console.log('📊 Table Statistics:\n');
        console.log('Table'.padEnd(20), 'Total Size'.padEnd(15), 'Table Size'.padEnd(15), 'Indexes Size');
        console.log('─'.repeat(80));
        tableStats.forEach(stat => {
            console.log(
                stat.tablename.padEnd(20),
                stat.total_size.padEnd(15),
                stat.table_size.padEnd(15),
                stat.indexes_size
            );
        });

        console.log('\n✅ Verification complete!\n');

    } catch (error) {
        console.error('❌ Error verifying indexes:', error.message);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

// Run verification
verifyIndexes();
