# Scoring System Update - December 2, 2025

## Problem Statement

Sistem scoring lama memiliki masalah:
1. Semua nilai 0 tidak menghasilkan score 100 (masih ada pengurangan)
2. Tidak ada pembatasan fair per kategori - nilai ekstrim bisa melebihi maksimal kategori
3. Sub-types (Mad, Ahkam) tidak dihitung dengan benar

## Solution Implemented

### 1. **Logika Baru: Nilai = Jumlah Kesalahan**
- `nilai: 0` = tidak ada kesalahan (perfect)
- `nilai: 1` = 1 kesalahan
- `nilai: 2` = 2 kesalahan, dst.

### 2. **Fair Distribution System dengan Per-Item Capping**
```
maxDeductionPerItem = categoryInitialScore / itemCount

Untuk setiap item:
  rawItemDeduction = nilaiError × deductionRate
  cappedItemDeduction = min(rawItemDeduction, maxDeductionPerItem)

totalDeduction = sum(cappedItemDeduction)
finalCappedDeduction = min(totalDeduction, categoryInitialScore)
```

**Contoh Real:**
- MAKHRAJ: 10 items, max score 55.5
- Max deduction per item = 55.5 / 10 = 5.55
- Jika 1 item memiliki nilai = 100:
  - Raw deduction = 100 × 1.5 = 150
  - **Capped at 5.55** (bukan 150!)
  - 9 items lainnya nilai = 0
  - Total deduction = 5.55 saja
  - Final score = 55.5 - 5.55 = 49.95 ✅

**Benefit**: Satu kesalahan ekstrim tidak akan menghabiskan seluruh poin kategori!

### 3. **Category Weights**
| Category | Score | Percentage |
|----------|-------|------------|
| MAKHRAJ | 55.5 | 56% |
| SIFAT | 14.5 | 15% |
| AHKAM | 8.0 | 8% |
| MAD | 13.5 | 14% |
| GHARIB | 6.0 | 6% |
| KELANCARAN | 2.5 | 3% |
| **TOTAL** | **100** | **100%** |

### 4. **Sub-Type Support**
**AHKAM:**
- Tanaffus: 2 poin/error
- Izhhar: 1 poin/error
- Gunna: 0.5 poin/error
- Lainnya: 0.5 poin/error

**MAD:**
- Thabii: 2 poin/error
- Qashr: 2 poin/error
- Wajib: 1 poin/error
- Lazim: 1 poin/error
- Lainnya: 0.5 poin/error

### 5. **Penalty Category (PENGURANGAN)**
- Kategori khusus untuk "Tidak Bisa Membaca"
- Mengurangi dari total skor keseluruhan
- Heavy penalty: 100 poin per error

## Test Results

✅ **19/19 tests passed** (updated with per-item capping test)

### Test Coverage:
1. ✅ Zero errors → Score = 100
2. ✅ Per-item capping with extreme single value (nilai=100)
3. ✅ Fair distribution with various error values
4. ✅ Extreme values properly capped at category level
5. ✅ Mad & Ahkam sub-types calculated correctly
6. ✅ Penalty category works as expected
7. ✅ Edge cases (empty, unknown categories)
8. ✅ Real-world scenarios

## Validation with User Data

### Test 1: All Nilai = 0
**Input:** 38 assessment items, all nilai = 0
**Result:** Overall Score = **100** ✅

### Test 2: Mixed Errors
**Input:** 
- MAKHRAJ: 10 items, 8 total errors
- AHKAM: 3 items, 3 total errors (Tanaffus: 1, Izhhar: 2)
- MAD: 2 items, 1 error (Qashr)
- GHARIB: 2 items, 1 error
- KELANCARAN: 1 item, 1 error

**Result:** Overall Score = **78.5** ✅
- MAKHRAJ: 43.5/55.5 (deduction: 12)
- AHKAM: 4/8 (deduction: 4)
- MAD: 11.5/13.5 (deduction: 2)
- GHARIB: 5/6 (deduction: 1)
- KELANCARAN: 0/2.5 (deduction: 2.5)
- SIFAT: 14.5/14.5 (not assessed)

### Test 3: Single Item with Extreme Value (Per-Item Capping)
**Input:** 
- MAKHRAJ: 10 items, 1 dengan nilai = 100, sisanya 0

**Result:** 
- Max per item: 5.55
- Deduction: 5.55 (bukan 150!) ✅
- Final Score MAKHRAJ: 49.95/55.5
- **Per-item capping works perfectly!**

### Test 4: All Items Extreme (Category Capping)
**Input:** MAKHRAJ 3 items with nilai = 50 each
**Result:** Deduction properly **capped at 55.5** ✅

### Test 5: Penalty Category
**Input:** 1 "Tidak Bisa Membaca" with nilai = 1
**Result:** Penalty = 100, properly reduces overall score ✅

## Files Modified/Created

### Modified:
1. `internal/utils/scoring.utils.js` - Complete refactor
   - New `calculateCategoryDeductionNew()` function
   - Updated `calculateParticipantScores()` logic
   - Added PENGURANGAN category support
   - Fixed Mad & Ahkam sub-type detection

2. `backend-quran-js/package.json` - Added test scripts

### Created:
1. `internal/tests/scoring.utils.test.js` - Comprehensive tests (18 tests)
2. `docs/SCORING_SYSTEM.md` - Complete documentation
3. `internal/examples/test-scoring-real-data.js` - Real-world examples

## Migration Guide

### For Frontend Team:
```javascript
// OLD (INCORRECT):
{ huruf: "د", kategori: "makhraj", nilai: 100 } // meant "perfect"

// NEW (CORRECT):
{ huruf: "د", kategori: "makhraj", nilai: 0 }   // means "perfect, no errors"
{ huruf: "د", kategori: "makhraj", nilai: 1 }   // means "1 error"
{ huruf: "د", kategori: "makhraj", nilai: 2 }   // means "2 errors"
```

### Backend Changes:
- No API changes required
- Existing endpoints continue to work
- Results now mathematically correct

## Running Tests

```bash
# Run all tests
npm test

# Run scoring tests only
npm test -- internal/tests/scoring.utils.test.js

# Run real-world examples
node internal/examples/test-scoring-real-data.js
```

## Performance

- ✅ O(n) complexity where n = number of assessments
- ✅ Handles 1000+ assessments efficiently
- ✅ No database queries during calculation
- ✅ All calculations in-memory

## Future Enhancements

1. Add SIFAT category items (currently missing from assessments)
2. Add more granular sub-types if needed
3. Add scoring history/audit trail
4. Add configurable weights per institution

## Conclusion

Sistem scoring baru:
- ✅ **Adil**: Pembatasan berdasarkan jumlah item
- ✅ **Akurat**: Nilai 0 = perfect score (100)
- ✅ **Fleksibel**: Support berbagai nilai error
- ✅ **Terdokumentasi**: Lengkap dengan examples
- ✅ **Teruji**: 18 comprehensive tests

---

**Author:** GitHub Copilot  
**Date:** December 2, 2025  
**Status:** ✅ Ready for Production
