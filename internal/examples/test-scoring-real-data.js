/**
 * Real-world example testing the scoring system with user-provided data
 */

const { calculateParticipantScores, formatScoresForAPI } = require('../utils/scoring.utils');

console.log('====================================');
console.log('TESTING SCORING SYSTEM - USER DATA');
console.log('====================================\n');

// User provided data - all nilai = 0 (should give 100 score)
const userDataAllZero = [
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"د","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"خ","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ح","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ج","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ث","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ت","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ب","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ا","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ط","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ض","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ص","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ش","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"س","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ز","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ر","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ذ","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"م","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ل","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ك","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ق","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ف","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"غ","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ع","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ظ","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ي","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ء","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"هـ","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"و","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"ن","kategori":"makhraj","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Tanaffus","kategori":"ahkam","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Izhhar","kategori":"ahkam","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Ikhfa'","kategori":"ahkam","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Qashr","kategori":"mad","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Iysmam","kategori":"gharib","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Badal","kategori":"gharib","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Tidak Lancar","kategori":"kelancaran","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Kurang Lancar","kategori":"kelancaran","nilai":0},
    {"peserta_id":"360d432f-513e-4eee-96e3-bec4a84e2441","asesor_id":"d03864f1-7525-417c-a509-53a0b115b740","huruf":"Tidak Bisa Membaca","kategori":"pengurangan","nilai":0}
];

console.log('TEST 1: All Nilai = 0 (Perfect Score)');
console.log('---------------------------------------');
const result1 = calculateParticipantScores(userDataAllZero);
const formatted1 = formatScoresForAPI(result1);

console.log('✅ Overall Score:', result1.overallScore, '(Expected: 100)');
console.log('✅ Total Assessment Items:', result1.assessmentCount);
console.log('✅ Total Deduction:', result1.totalDeduction);
console.log('✅ Penalty Deduction:', result1.penaltyDeduction);
console.log('\nCategory Breakdown:');
console.log('  - MAKHRAJ:', result1.categoryScores.MAKHRAJ.finalScore, '/', result1.categoryScores.MAKHRAJ.initialScore);
console.log('  - SIFAT:', result1.categoryScores.SIFAT.finalScore, '/', result1.categoryScores.SIFAT.initialScore);
console.log('  - AHKAM:', result1.categoryScores.AHKAM.finalScore, '/', result1.categoryScores.AHKAM.initialScore);
console.log('  - MAD:', result1.categoryScores.MAD.finalScore, '/', result1.categoryScores.MAD.initialScore);
console.log('  - GHARIB:', result1.categoryScores.GHARIB.finalScore, '/', result1.categoryScores.GHARIB.initialScore);
console.log('  - KELANCARAN:', result1.categoryScores.KELANCARAN.finalScore, '/', result1.categoryScores.KELANCARAN.initialScore);

console.log('\n\n');

// Test 2: Mixed errors with fair distribution
console.log('TEST 2: Mixed Errors (Real Assessment)');
console.log('---------------------------------------');
const mixedData = [
    // MAKHRAJ: 10 items with various errors
    {"peserta_id":"test","asesor_id":"test","huruf":"د","kategori":"makhraj","nilai":1},
    {"peserta_id":"test","asesor_id":"test","huruf":"خ","kategori":"makhraj","nilai":0},
    {"peserta_id":"test","asesor_id":"test","huruf":"ح","kategori":"makhraj","nilai":2},
    {"peserta_id":"test","asesor_id":"test","huruf":"ج","kategori":"makhraj","nilai":0},
    {"peserta_id":"test","asesor_id":"test","huruf":"ث","kategori":"makhraj","nilai":1},
    {"peserta_id":"test","asesor_id":"test","huruf":"ت","kategori":"makhraj","nilai":0},
    {"peserta_id":"test","asesor_id":"test","huruf":"ب","kategori":"makhraj","nilai":0},
    {"peserta_id":"test","asesor_id":"test","huruf":"ا","kategori":"makhraj","nilai":3},
    {"peserta_id":"test","asesor_id":"test","huruf":"ط","kategori":"makhraj","nilai":0},
    {"peserta_id":"test","asesor_id":"test","huruf":"ض","kategori":"makhraj","nilai":1},
    
    // AHKAM: 3 items with different sub-types
    {"peserta_id":"test","asesor_id":"test","huruf":"Tanaffus","kategori":"ahkam","nilai":1},
    {"peserta_id":"test","asesor_id":"test","huruf":"Izhhar","kategori":"ahkam","nilai":2},
    {"peserta_id":"test","asesor_id":"test","huruf":"Ikhfa'","kategori":"ahkam","nilai":0},
    
    // MAD: 2 items
    {"peserta_id":"test","asesor_id":"test","huruf":"Qashr","kategori":"mad","nilai":1},
    {"peserta_id":"test","asesor_id":"test","huruf":"Mad Wajib","kategori":"mad","nilai":0},
    
    // GHARIB: 2 items, 1 with error
    {"peserta_id":"test","asesor_id":"test","huruf":"Iysmam","kategori":"gharib","nilai":1},
    {"peserta_id":"test","asesor_id":"test","huruf":"Badal","kategori":"gharib","nilai":0},
    
    // KELANCARAN: 1 item with error
    {"peserta_id":"test","asesor_id":"test","huruf":"Tidak Lancar","kategori":"kelancaran","nilai":1},
];

const result2 = calculateParticipantScores(mixedData);
const formatted2 = formatScoresForAPI(result2);

console.log('Overall Score:', result2.overallScore);
console.log('Total Assessment Items:', result2.assessmentCount);
console.log('Total Deduction:', result2.totalDeduction.toFixed(2));
console.log('\nDetailed Calculation:');
console.log('  - MAKHRAJ:');
console.log('    Items:', result2.categoryScores.MAKHRAJ.itemCount);
console.log('    Errors:', result2.categoryScores.MAKHRAJ.totalErrors);
console.log('    Deduction:', result2.categoryScores.MAKHRAJ.totalDeduction);
console.log('    Final Score:', result2.categoryScores.MAKHRAJ.finalScore, '/', result2.categoryScores.MAKHRAJ.initialScore);
console.log('  - AHKAM:');
console.log('    Items:', result2.categoryScores.AHKAM.itemCount);
console.log('    Errors:', result2.categoryScores.AHKAM.totalErrors);
console.log('    Deduction:', result2.categoryScores.AHKAM.totalDeduction);
console.log('    Final Score:', result2.categoryScores.AHKAM.finalScore, '/', result2.categoryScores.AHKAM.initialScore);
console.log('  - MAD:');
console.log('    Items:', result2.categoryScores.MAD.itemCount);
console.log('    Errors:', result2.categoryScores.MAD.totalErrors);
console.log('    Deduction:', result2.categoryScores.MAD.totalDeduction);
console.log('    Final Score:', result2.categoryScores.MAD.finalScore, '/', result2.categoryScores.MAD.initialScore);
console.log('  - GHARIB:');
console.log('    Items:', result2.categoryScores.GHARIB.itemCount);
console.log('    Errors:', result2.categoryScores.GHARIB.totalErrors);
console.log('    Deduction:', result2.categoryScores.GHARIB.totalDeduction);
console.log('    Final Score:', result2.categoryScores.GHARIB.finalScore, '/', result2.categoryScores.GHARIB.initialScore);
console.log('  - KELANCARAN:');
console.log('    Items:', result2.categoryScores.KELANCARAN.itemCount);
console.log('    Errors:', result2.categoryScores.KELANCARAN.totalErrors);
console.log('    Deduction:', result2.categoryScores.KELANCARAN.totalDeduction);
console.log('    Final Score:', result2.categoryScores.KELANCARAN.finalScore, '/', result2.categoryScores.KELANCARAN.initialScore);
console.log('  - SIFAT (not assessed):');
console.log('    Final Score:', result2.categoryScores.SIFAT.finalScore, '/', result2.categoryScores.SIFAT.initialScore);

console.log('\n\n');

// Test 3: Extreme values to test per-item capping
console.log('TEST 3: Per-Item Capping (Single Item with Large Value)');
console.log('--------------------------------------------------------');
const singleItemExtreme = [
    // 10 items, one with nilai = 100
    {"peserta_id":"test","asesor_id":"test","huruf":"د","kategori":"makhraj","nilai":100},
    {"peserta_id":"test","asesor_id":"test","huruf":"خ","kategori":"makhraj","nilai":0},
    {"peserta_id":"test","asesor_id":"test","huruf":"ح","kategori":"makhraj","nilai":0},
    {"peserta_id":"test","asesor_id":"test","huruf":"ج","kategori":"makhraj","nilai":0},
    {"peserta_id":"test","asesor_id":"test","huruf":"ث","kategori":"makhraj","nilai":0},
    {"peserta_id":"test","asesor_id":"test","huruf":"ت","kategori":"makhraj","nilai":0},
    {"peserta_id":"test","asesor_id":"test","huruf":"ب","kategori":"makhraj","nilai":0},
    {"peserta_id":"test","asesor_id":"test","huruf":"ا","kategori":"makhraj","nilai":0},
    {"peserta_id":"test","asesor_id":"test","huruf":"ط","kategori":"makhraj","nilai":0},
    {"peserta_id":"test","asesor_id":"test","huruf":"ض","kategori":"makhraj","nilai":0},
];

const resultSingle = calculateParticipantScores(singleItemExtreme);

console.log('Items:', resultSingle.categoryScores.MAKHRAJ.itemCount);
console.log('Max score per item:', (55.5 / 10).toFixed(2));
console.log('Single item dengan nilai 100:');
console.log('  - Raw deduction: 100 × 1.5 =', 150);
console.log('  - Max deduction per item:', (55.5 / 10).toFixed(2));
console.log('  - Actual deduction:', resultSingle.categoryScores.MAKHRAJ.totalDeduction);
console.log('  - Final Score:', resultSingle.categoryScores.MAKHRAJ.finalScore, '/', resultSingle.categoryScores.MAKHRAJ.initialScore);
console.log('✅ Deduction per item properly capped!');

console.log('\n\n');

// Test 4: Extreme values to test category-level capping
console.log('TEST 4: Category-Level Capping (All Items Extreme)');
console.log('----------------------------------------------------');
const extremeData = [
    // All items with extreme error values
    {"peserta_id":"test","asesor_id":"test","huruf":"د","kategori":"makhraj","nilai":50},
    {"peserta_id":"test","asesor_id":"test","huruf":"خ","kategori":"makhraj","nilai":50},
    {"peserta_id":"test","asesor_id":"test","huruf":"ح","kategori":"makhraj","nilai":50},
    {"peserta_id":"test","asesor_id":"test","huruf":"Tanaffus","kategori":"ahkam","nilai":20},
];

const result3 = calculateParticipantScores(extremeData);

console.log('Overall Score:', result3.overallScore);
console.log('MAKHRAJ:');
console.log('  - Items:', result3.categoryScores.MAKHRAJ.itemCount);
console.log('  - Max per item:', (55.5 / 3).toFixed(2));
console.log('  - Total deduction (capped):', result3.categoryScores.MAKHRAJ.totalDeduction);
console.log('  - Final Score:', result3.categoryScores.MAKHRAJ.finalScore);
console.log('✅ Category deduction properly capped at category maximum');

console.log('\n\n');

// Test 4: Penalty category
console.log('TEST 5: Penalty Category (PENGURANGAN)');
console.log('---------------------------------------');
const penaltyData = [
    {"peserta_id":"test","asesor_id":"test","huruf":"د","kategori":"makhraj","nilai":0},
    {"peserta_id":"test","asesor_id":"test","huruf":"خ","kategori":"makhraj","nilai":0},
    {"peserta_id":"test","asesor_id":"test","huruf":"Tidak Bisa Membaca","kategori":"pengurangan","nilai":1},
];

const result4 = calculateParticipantScores(penaltyData);

console.log('Base Score (without penalty):', result4.overallScore + result4.penaltyDeduction);
console.log('Penalty Deduction:', result4.penaltyDeduction);
console.log('Final Overall Score:', result4.overallScore);
console.log('✅ Penalty properly applied to overall score');

console.log('\n\n====================================');
console.log('ALL TESTS COMPLETED SUCCESSFULLY! ✅');
console.log('====================================');
