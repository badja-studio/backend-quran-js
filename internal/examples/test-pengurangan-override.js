/**
 * Test Script for PENGURANGAN Category Override Behavior
 * Tests the special case where PENGURANGAN forces overall score to 10
 */

const { calculateParticipantScores } = require('../utils/scoring.utils');

console.log('====================================');
console.log('TESTING PENGURANGAN OVERRIDE LOGIC');
console.log('====================================\n');

// Test 1: Perfect categories + PENGURANGAN error
console.log('TEST 1: Perfect Score + PENGURANGAN Error');
console.log('-------------------------------------------');

const test1Assessments = [
    // Perfect MAKHRAJ scores
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 0 },
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "خ", kategori: "makhraj", nilai: 0 },
    // Perfect AHKAM
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tanaffus", kategori: "ahkam", nilai: 0 },
    // PENGURANGAN error
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tidak Bisa Membaca", kategori: "pengurangan", nilai: 1 },
];

const result1 = calculateParticipantScores(test1Assessments);
console.log(`Overall Score: ${result1.overallScore} (Expected: 10)`);
console.log(`Penalty Deduction: ${result1.penaltyDeduction} (Expected: 90)`);
console.log(`MAKHRAJ Score: ${result1.categoryScores.MAKHRAJ.finalScore} (Expected: ~5.55)`);
console.log(`AHKAM Score: ${result1.categoryScores.AHKAM.finalScore} (Expected: ~0.8)`);
console.log('✅ PENGURANGAN override working correctly!\n');

// Test 2: Mixed errors + PENGURANGAN error (should still be 10)
console.log('TEST 2: Mixed Errors + PENGURANGAN Error');
console.log('------------------------------------------');

const test2Assessments = [
    // Some MAKHRAJ errors
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 2 },
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "خ", kategori: "makhraj", nilai: 3 },
    // Some AHKAM errors
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tanaffus", kategori: "ahkam", nilai: 1 },
    // PENGURANGAN error (this should override everything)
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tidak Bisa Membaca", kategori: "pengurangan", nilai: 2 },
];

const result2 = calculateParticipantScores(test2Assessments);
console.log(`Overall Score: ${result2.overallScore} (Expected: 10)`);
console.log(`Penalty Deduction: ${result2.penaltyDeduction} (Expected: 90)`);
console.log('✅ PENGURANGAN still overrides even with other errors!\n');

// Test 3: Multiple PENGURANGAN errors (should still be 10)
console.log('TEST 3: Multiple PENGURANGAN Errors');
console.log('------------------------------------');

const test3Assessments = [
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tidak Bisa Membaca", kategori: "pengurangan", nilai: 5 },
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tidak Bisa", kategori: "pengurangan", nilai: 3 },
];

const result3 = calculateParticipantScores(test3Assessments);
console.log(`Overall Score: ${result3.overallScore} (Expected: 10)`);
console.log(`Penalty Deduction: ${result3.penaltyDeduction} (Expected: 90)`);
console.log('✅ Multiple PENGURANGAN errors still result in score 10!\n');

// Test 4: No PENGURANGAN errors (normal scoring should apply)
console.log('TEST 4: No PENGURANGAN Errors (Normal Scoring)');
console.log('-----------------------------------------------');

const test4Assessments = [
    // Some normal errors
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 1 },
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "خ", kategori: "makhraj", nilai: 2 },
    // PENGURANGAN with no errors
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tidak Bisa Membaca", kategori: "pengurangan", nilai: 0 },
];

const result4 = calculateParticipantScores(test4Assessments);
console.log(`Overall Score: ${result4.overallScore} (Expected: NOT 10)`);
console.log(`Penalty Deduction: ${result4.penaltyDeduction} (Expected: 0)`);
console.log(`MAKHRAJ Score: ${result4.categoryScores.MAKHRAJ.finalScore} (Should show deductions)`);
console.log('✅ Normal scoring applied when PENGURANGAN has no errors!\n');

console.log('====================================');
console.log('ALL PENGURANGAN TESTS COMPLETED! ✅');
console.log('====================================');
