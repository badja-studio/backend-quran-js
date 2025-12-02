# Scoring System Documentation

## Overview

Sistem scoring untuk penilaian bacaan Al-Quran yang adil dan komprehensif. Sistem ini dirancang dengan prinsip:

1. **Nilai Default = 100**: Jika semua item dinilai 0 (tidak ada kesalahan), maka skor total = 100
2. **Fair Distribution**: Pengurangan dibatasi berdasarkan jumlah item per kategori
3. **Flexible Error Values**: Sistem menerima berbagai nilai kesalahan (0, 1, 2, 3, dst.)

## Kategori Penilaian

### 1. MAKHRAJ (Makharijul Huruf) - 55.5 poin (56%)
- **Jumlah huruf**: 29 huruf hijaiyah
- **Deduction per error**: 1.5 poin
- **Maximum deduction**: 55.5 poin (capped)

### 2. SIFAT (Sifatul Huruf) - 14.5 poin (15%)
- **Deduction per error**: 0.5 poin
- **Maximum deduction**: 14.5 poin (capped)

### 3. AHKAM (Ahkamul Huruf) - 8 poin (8%)
- **Sub-types dengan bobot berbeda**:
  - Tanaffus: 2 poin per error
  - Izhhar: 1 poin per error
  - Gunna: 0.5 poin per error
  - Lainnya: 0.5 poin per error
- **Maximum deduction**: 8 poin (capped)

### 4. MAD (Ahkamul Mad) - 13.5 poin (14%)
- **Sub-types dengan bobot berbeda**:
  - Thabii: 2 poin per error
  - Qashr: 2 poin per error
  - Wajib: 1 poin per error
  - Lazim: 1 poin per error
  - Lainnya: 0.5 poin per error
- **Maximum deduction**: 13.5 poin (capped)

### 5. GHARIB (Kalimat Gharib) - 6 poin (6%)
- **Deduction per error**: 1 poin
- **Maximum deduction**: 6 poin (capped)

### 6. KELANCARAN (Fluency) - 2.5 poin (3%)
- **Deduction per error**: 2.5 poin
- **Maximum deduction**: 2.5 poin (capped)

### 7. PENGURANGAN (Penalty) - Special Category
- **Bobot**: Mengurangi dari total skor keseluruhan
- **Deduction per error**: 100 poin (extreme penalty)
- **Use case**: Tidak bisa membaca sama sekali
- **Maximum deduction**: Terbatas per jumlah item

## Logika Scoring

### Prinsip Dasar

```javascript
// Untuk setiap kategori:
maxDeductionPerItem = categoryInitialScore / itemCount

// Untuk setiap item:
rawItemDeduction = nilaiError * deductionRate
cappedItemDeduction = min(rawItemDeduction, maxDeductionPerItem)

// Total kategori:
totalDeduction = sum(cappedItemDeduction per item)
cappedTotalDeduction = min(totalDeduction, categoryInitialScore)
finalScore = max(0, categoryInitialScore - cappedTotalDeduction)
```

### Prinsip Fair Distribution

1. **Per-Item Capping**: Setiap item dibatasi maksimal pengurangan berdasarkan `maxDeductionPerItem`
2. **Category Capping**: Total pengurangan kategori tidak boleh melebihi `categoryInitialScore`
3. **Fair & Balanced**: Satu item dengan nilai ekstrim tidak akan menghabiskan seluruh poin kategori

### Contoh 1: Semua Nilai = 0 (Perfect Score)

```json
{
  "assessments": [
    {"huruf": "د", "kategori": "makhraj", "nilai": 0},
    {"huruf": "خ", "kategori": "makhraj", "nilai": 0},
    // ... 27 huruf makhraj lainnya dengan nilai 0
    {"huruf": "Tanaffus", "kategori": "ahkam", "nilai": 0},
    {"huruf": "Izhhar", "kategori": "ahkam", "nilai": 0},
    {"huruf": "Ikhfa'", "kategori": "ahkam", "nilai": 0},
    {"huruf": "Qashr", "kategori": "mad", "nilai": 0},
    {"huruf": "Iysmam", "kategori": "gharib", "nilai": 0},
    {"huruf": "Badal", "kategori": "gharib", "nilai": 0},
    {"huruf": "Tidak Lancar", "kategori": "kelancaran", "nilai": 0},
    {"huruf": "Kurang Lancar", "kategori": "kelancaran", "nilai": 0},
    {"huruf": "Tidak Bisa Membaca", "kategori": "pengurangan", "nilai": 0}
  ]
}
```

**Result**: Overall Score = **100** ✅

### Contoh 2: Mixed Errors dengan Fair Distribution

```json
{
  "assessments": [
    // MAKHRAJ: 5 items, 2 with errors
    {"huruf": "د", "kategori": "makhraj", "nilai": 0},
    {"huruf": "خ", "kategori": "makhraj", "nilai": 1},
    {"huruf": "ح", "kategori": "makhraj", "nilai": 0},
    {"huruf": "ج", "kategori": "makhraj", "nilai": 2},
    {"huruf": "ث", "kategori": "makhraj", "nilai": 0},
    
    // AHKAM: 3 items, 1 with error (Izhhar)
    {"huruf": "Tanaffus", "kategori": "ahkam", "nilai": 0},
    {"huruf": "Izhhar", "kategori": "ahkam", "nilai": 1},
    {"huruf": "Ikhfa'", "kategori": "ahkam", "nilai": 0},
    
    // MAD: 2 items, 1 with error (Qashr)
    {"huruf": "Qashr", "kategori": "mad", "nilai": 1},
    {"huruf": "Mad Wajib", "kategori": "mad", "nilai": 0}
  ]
}
```

**Calculation**:
- **MAKHRAJ**: 
  - Total errors = 1 + 2 = 3
  - Deduction = 3 × 1.5 = 4.5
  - Final = 55.5 - 4.5 = **51**

- **AHKAM**: 
  - Izhhar: 1 error × 1 = 1
  - Deduction = 1
  - Final = 8 - 1 = **7**

- **MAD**: 
  - Qashr: 1 error × 2 = 2
  - Deduction = 2
  - Final = 13.5 - 2 = **11.5**

- **SIFAT**: Not assessed = **14.5** (default)
- **GHARIB**: Not assessed = **6** (default)
- **KELANCARAN**: Not assessed = **2.5** (default)

**Overall Score** = 51 + 7 + 11.5 + 14.5 + 6 + 2.5 = **92.5** ✅

### Contoh 3: Single Item dengan Nilai Ekstrim - Per-Item Capping

```json
{
  "assessments": [
    // 10 items MAKHRAJ, satu dengan nilai = 100
    {"huruf": "د", "kategori": "makhraj", "nilai": 100},
    {"huruf": "خ", "kategori": "makhraj", "nilai": 0},
    {"huruf": "ح", "kategori": "makhraj", "nilai": 0},
    // ... 7 items lagi dengan nilai 0
  ]
}
```

**Calculation**:
- **MAKHRAJ**: 
  - Total items = 10
  - Max deduction per item = 55.5 ÷ 10 = **5.55**
  - Item "د": nilai = 100
    - Raw deduction = 100 × 1.5 = 150
    - **Capped at 5.55** (max per item)
  - Other 9 items: nilai = 0, deduction = 0
  - Total deduction = 5.55
  - Final = 55.5 - 5.55 = **49.95** ✅

**Key Point**: Meskipun satu item memiliki nilai 100, pengurangan dibatasi maksimal 5.55 saja (bukan 150). Ini memastikan keadilan - satu kesalahan besar tidak menghilangkan seluruh poin kategori.

### Contoh 4: All Items Extreme Values - Category Capping

```json
{
  "assessments": [
    // MAKHRAJ: 3 items, semua dengan nilai=50 (extreme)
    {"huruf": "د", "kategori": "makhraj", "nilai": 50},
    {"huruf": "خ", "kategori": "makhraj", "nilai": 50},
    {"huruf": "ح", "kategori": "makhraj", "nilai": 50}
  ]
}
```

**Calculation**:
- **MAKHRAJ**: 
  - Total items = 3
  - Max per item = 55.5 ÷ 3 = 18.5
  - Item 1: 50 × 1.5 = 75, **capped at 18.5**
  - Item 2: 50 × 1.5 = 75, **capped at 18.5**
  - Item 3: 50 × 1.5 = 75, **capped at 18.5**
  - Total = 18.5 + 18.5 + 18.5 = 55.5
  - **Capped at category max = 55.5**
  - Final = 55.5 - 55.5 = **0**

Sistem memastikan pengurangan tidak melebihi nilai maksimal kategori, bahkan dengan nilai ekstrim.

## API Usage

### Input Format

```javascript
const assessments = [
  {
    peserta_id: "uuid",
    asesor_id: "uuid",
    huruf: "د",           // Huruf/item yang dinilai
    kategori: "makhraj",  // Kategori penilaian
    nilai: 0              // Jumlah kesalahan (0 = perfect)
  },
  // ... more assessments
];
```

### Calculate Scores

```javascript
const { calculateParticipantScores } = require('./utils/scoring.utils');

const result = calculateParticipantScores(assessments);

console.log(result);
// {
//   categoryScores: {
//     MAKHRAJ: { initialScore, finalScore, totalErrors, totalDeduction, ... },
//     SIFAT: { ... },
//     AHKAM: { ... },
//     MAD: { ... },
//     GHARIB: { ... },
//     KELANCARAN: { ... },
//     PENGURANGAN: { ... }
//   },
//   overallScore: 100,
//   totalDeduction: 0,
//   penaltyDeduction: 0,
//   assessmentCount: 38,
//   calculatedAt: "2025-12-02T..."
// }
```

### Format for API Response

```javascript
const { formatScoresForAPI } = require('./utils/scoring.utils');

const formatted = formatScoresForAPI(result);

console.log(formatted);
// {
//   scores: {
//     makhraj: 55.5,
//     sifat: 14.5,
//     ahkam: 8,
//     mad: 13.5,
//     gharib: 6,
//     kelancaran: 2.5,
//     overall: 100
//   },
//   details: {
//     categoryBreakdown: { ... },
//     totalDeduction: 0,
//     assessmentCount: 38,
//     calculatedAt: "..."
//   }
// }
```

## Testing

Jalankan comprehensive tests:

```bash
npm test -- internal/tests/scoring.utils.test.js
```

Test coverage meliputi:
- ✅ Zero errors (perfect score)
- ✅ Fair distribution dengan berbagai nilai error
- ✅ Penalty category (PENGURANGAN)
- ✅ Mad & Ahkam sub-types
- ✅ Edge cases (empty, unknown categories)
- ✅ Real-world scenarios

## Key Features

1. **Fair & Balanced**: Pengurangan dibatasi per kategori dan per item
2. **Flexible Input**: Menerima nilai error 0 hingga tak terbatas
3. **Comprehensive**: Mendukung 7 kategori dengan sub-types
4. **Well-Tested**: 18 comprehensive tests
5. **Type-Safe**: Clear input/output structures
6. **Documented**: Lengkap dengan contoh penggunaan

## Migration Notes

Jika menggunakan sistem lama:
- **Pastikan** frontend mengirim `nilai` sebagai **jumlah kesalahan**, bukan score
- `nilai = 0` berarti **tidak ada kesalahan** (perfect)
- `nilai > 0` berarti **ada kesalahan** sebanyak nilai tersebut

## Support

Untuk pertanyaan atau issue, silakan hubungi tim development.
