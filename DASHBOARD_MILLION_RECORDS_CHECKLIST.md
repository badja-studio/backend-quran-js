# Dashboard Checklist untuk Jutaan Data

## ⚠️ CRITICAL: Wajib Dikerjakan Sebelum Production

### 1. **JALANKAN INDEXES** 🔥 PALING PENTING

```bash
# Connect ke database
psql -h localhost -U your_user -d your_database

# Jalankan index script
\i add-dashboard-indexes.sql

# Tunggu 10-20 menit (tergantung jumlah data)
# Monitor progress:
SELECT * FROM pg_stat_progress_create_index;
```

**TANPA INDEX INI, DASHBOARD AKAN:**
- Query 30+ detik
- Timeout errors
- Server crash dengan jutaan data

---

### 2. **VERIFIKASI INDEXES TERINSTALL**

```sql
-- Check semua index sudah ada
SELECT
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexname::regclass)) as size
FROM pg_indexes
WHERE tablename IN ('participants', 'assessments')
    AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
```

**Expected output:**
```
tablename    | indexname                                    | size
-------------+----------------------------------------------+--------
assessments  | idx_assessments_kategori_huruf              | 42 MB
assessments  | idx_assessments_kategori_trgm               | 38 MB
assessments  | idx_assessments_nilai_kategori              | 28 MB
assessments  | idx_assessments_peserta_id                  | 21 MB  ← CRITICAL
assessments  | idx_assessments_peserta_kategori            | 35 MB
participants | idx_participants_jenjang                    | 8 MB
participants | idx_participants_jenis_kelamin              | 6 MB
participants | idx_participants_jenis_pt                   | 7 MB
participants | idx_participants_provinsi                   | 9 MB
participants | idx_participants_provinsi_covering          | 18 MB
participants | idx_participants_status_jenjang_completed   | 12 MB
participants | idx_participants_status_provinsi_completed  | 11 MB
```

---

### 3. **GUNAKAN OPTIMIZED REPOSITORY (Optional tapi Recommended)**

Untuk jutaan data, ganti ke versi optimized:

```javascript
// File: internal/repository/dashboard.repository.js

// OPTION A: Ganti isi file dengan dashboard.repository.optimized.js
// OPTION B: Import yang optimized:
const dashboardRepository = require('./dashboard.repository.optimized');
```

**Keuntungan versi optimized:**
- ✅ RAW SQL (lebih cepat dari Sequelize JOIN)
- ✅ LIMIT 50 untuk province data (prevent memory bloat)
- ✅ HAVING filter (exclude provinces dengan data < 10)
- ✅ Explicit index hints

---

### 4. **MONITORING QUERY PERFORMANCE**

Enable slow query logging:

```sql
-- Di PostgreSQL, set slow query threshold
ALTER DATABASE your_database SET log_min_duration_statement = 1000; -- 1 second

-- Check slow queries
SELECT
    calls,
    mean_exec_time::numeric(10,2) as avg_ms,
    query
FROM pg_stat_statements
WHERE query LIKE '%participants%' OR query LIKE '%assessments%'
ORDER BY mean_exec_time DESC
LIMIT 10;
```

**Target performance dengan index:**
- Simple queries (COUNT, AVG): < 50ms
- GROUP BY queries: < 100ms
- JOIN queries: < 200ms

---

### 5. **CACHE SIZE MONITORING**

Monitor in-memory cache size:

```javascript
// Tambahkan di dashboard.controller.js setelah line 12

// Log cache size setiap 1 jam
setInterval(() => {
    const cacheSize = cache.size;
    const estimatedMemory = JSON.stringify([...cache.values()]).length;
    console.log(`[Cache] Entries: ${cacheSize}, Memory: ~${(estimatedMemory / 1024 / 1024).toFixed(2)}MB`);
}, 60 * 60 * 1000);
```

**Warning threshold:**
- Cache > 100MB per endpoint = **DANGER**
- Total cache > 500MB = **SWITCH TO REDIS**

---

### 6. **STRESS TEST**

Test dengan load simulator:

```bash
# Install k6 (load testing tool)
npm install -g k6

# Create test script: test-dashboard.js
cat > test-dashboard.js << 'EOF'
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // 50 users
    { duration: '3m', target: 100 },  // 100 users
    { duration: '1m', target: 0 },    // ramp down
  ],
};

export default function () {
  const endpoints = [
    '/api/dashboard/statistics',
    '/api/dashboard/participation',
    '/api/dashboard/demographics',
    '/api/dashboard/performance',
  ];

  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const res = http.get(`http://localhost:3000${endpoint}`, {
    headers: { Authorization: 'Bearer YOUR_TOKEN' },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
EOF

# Run test
k6 run test-dashboard.js
```

**Expected results:**
- ✅ P95 response time < 500ms
- ✅ P99 response time < 1000ms
- ✅ No errors
- ✅ Memory stable (no leaks)

---

## 🎯 SCALABILITY LIMITS

### Current Implementation (Simple Repository)

| Data Size | Performance | Status |
|-----------|-------------|--------|
| < 100K participants | Excellent (< 100ms) | ✅ SAFE |
| 100K - 500K participants | Good (100-300ms) | ✅ SAFE with indexes |
| 500K - 1M participants | Acceptable (300-500ms) | ⚠️ Monitor carefully |
| > 1M participants | Slow (500ms+) | ❌ Use optimized version |

### Optimized Repository (dashboard.repository.optimized.js)

| Data Size | Performance | Status |
|-----------|-------------|--------|
| < 1M participants | Excellent (< 100ms) | ✅ SAFE |
| 1M - 5M participants | Good (100-300ms) | ✅ SAFE with indexes |
| 5M - 10M participants | Acceptable (300-500ms) | ⚠️ Consider sharding |
| > 10M participants | Variable | ❌ Requires database sharding |

---

## 🚨 WARNING SIGNS

Jika melihat ini, **SEGERA OPTIMASI:**

1. **Query timeout errors** in logs
2. **Response time > 2 seconds** consistently
3. **Memory usage growing** continuously
4. **Database CPU > 80%** sustained
5. **Cache size > 500MB**

---

## 📋 PRODUCTION DEPLOYMENT CHECKLIST

- [ ] Run `add-dashboard-indexes.sql`
- [ ] Verify all indexes exist
- [ ] Test all endpoints dengan data production
- [ ] Monitor slow queries for 1 week
- [ ] Check cache memory usage
- [ ] Run stress test
- [ ] Setup monitoring alerts (response time, memory)
- [ ] Document performance baselines

---

## 🔧 RECOMMENDED SETUP untuk Jutaan Data

```javascript
// .env configuration
CACHE_DASHBOARD_TTL=3600  # 1 hour
DB_POOL_MAX=50            # Increase connection pool
DB_POOL_MIN=10
DB_ACQUIRE_TIMEOUT=60000  # 60 seconds
```

---

## 📞 ESCALATION

Jika tetap slow setelah optimasi:

1. **Switch to materialized views** (pre-computed aggregations)
2. **Use Redis for caching** (distributed cache)
3. **Implement pagination** for large result sets
4. **Database sharding** for 10M+ records
5. **Use read replicas** for dashboard queries

---

**Status: ⚠️ CURRENT IMPLEMENTATION NEEDS INDEXES FOR MILLIONS OF RECORDS**

**Recommendation: Run indexes FIRST, then use optimized repository if needed**
