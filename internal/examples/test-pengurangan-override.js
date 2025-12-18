/**
 * Test Script for Granular PENGURANGAN Rules
 * Tests all 8 pengurangan types with their specific deduction amounts
 */

const { calculateParticipantScores } = require('../utils/scoring.utils');

console.log('=====================================================');
console.log('TESTING GRANULAR PENGURANGAN DEDUCTION RULES');
console.log('=====================================================\n');

// Test 1: 100 Deduction Types (Complete Failure - Score = 0)
console.log('TEST 1: 100 Deduction - Complete Failure (Score = 0)');
console.log('------------------------------------------------------');

const test100Deductions = [
    { huruf: "Suara Tidak Ada", name: "No Audio" },
    { huruf: "Video Rusak", name: "Broken Video" },
    { huruf: "Terindikasi Dubbing", name: "Suspected Dubbing" },
    { huruf: "Maqro yang dibaca tidak sesuai", name: "Maqro doesn't match" }
];

test100Deductions.forEach(type => {
    const assessments = [
        { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 0 },
        { peserta_id: "test-1", asesor_id: "asesor-1", huruf: type.huruf, kategori: "pengurangan", nilai: 1 },
    ];

    const result = calculateParticipantScores(assessments);
    console.log(`  ${type.name} ("${type.huruf}")`);
    console.log(`    Score: ${result.overallScore} (Expected: 0)`);
    console.log(`    Penalty: ${result.penaltyDeduction} (Expected: 100)`);
    console.log(`    ✅ ${result.overallScore === 0 && result.penaltyDeduction === 100 ? 'PASS' : 'FAIL'}`);
});

console.log('\n');

// Test 2: 90 Deduction (Severe Failure - Score = 10)
console.log('TEST 2: 90 Deduction - Severe Failure (Score = 10)');
console.log('---------------------------------------------------');

const assessments90 = [
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tidak Bisa Membaca", kategori: "pengurangan", nilai: 1 },
];

const result90 = calculateParticipantScores(assessments90);
console.log(`  Cannot Read ("Tidak Bisa Membaca")`);
console.log(`    Score: ${result90.overallScore} (Expected: 10)`);
console.log(`    Penalty: ${result90.penaltyDeduction} (Expected: 90)`);
console.log(`    ✅ ${result90.overallScore === 10 && result90.penaltyDeduction === 90 ? 'PASS' : 'FAIL'}`);

console.log('\n');

// Test 3: 50 Deduction (Partial Penalty)
console.log('TEST 3: 50 Deduction - Partial Penalty');
console.log('---------------------------------------');

const assessments50 = [
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 0 },
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Maqro yg dibaca cuma sebagian", kategori: "pengurangan", nilai: 1 },
];

const result50 = calculateParticipantScores(assessments50);
console.log(`  Only Partial Maqro ("Maqro yg dibaca cuma sebagian")`);
console.log(`    Score: ${result50.overallScore} (Expected: 50)`);
console.log(`    Penalty: ${result50.penaltyDeduction} (Expected: 50)`);
console.log(`    Base Score: 100, After -50: ${result50.overallScore}`);
console.log(`    ✅ ${result50.overallScore === 50 && result50.penaltyDeduction === 50 ? 'PASS' : 'FAIL'}`);

console.log('\n');

// Test 4: 0 Deduction (No Effect - Informational)
console.log('TEST 4: 0 Deduction - No Effect (Informational)');
console.log('------------------------------------------------');

const test0Deductions = [
    { huruf: "Video Tidak Ada Gambar", name: "Video Has No Image" },
    { huruf: "Ayat yg Dibaca Tidak Sesuai", name: "Recited Verse Doesn't Match" }
];

test0Deductions.forEach(type => {
    const assessments = [
        { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 0 },
        { peserta_id: "test-1", asesor_id: "asesor-1", huruf: type.huruf, kategori: "pengurangan", nilai: 1 },
    ];

    const result = calculateParticipantScores(assessments);
    console.log(`  ${type.name} ("${type.huruf}")`);
    console.log(`    Score: ${result.overallScore} (Expected: 100)`);
    console.log(`    Penalty: ${result.penaltyDeduction} (Expected: 0)`);
    console.log(`    ✅ ${result.overallScore === 100 && result.penaltyDeduction === 0 ? 'PASS' : 'FAIL'}`);
});

console.log('\n');

// Test 5: Multiple Pengurangan - Highest Wins
console.log('TEST 5: Multiple Pengurangan - Highest Deduction Wins');
console.log('------------------------------------------------------');

const multipleTests = [
    {
        name: "100 + 50 → 100 wins (score = 0)",
        assessments: [
            { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Video Rusak", kategori: "pengurangan", nilai: 1 },
            { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Maqro yg dibaca cuma sebagian", kategori: "pengurangan", nilai: 1 },
        ],
        expectedScore: 0,
        expectedPenalty: 100
    },
    {
        name: "90 + 50 → 90 wins (score = 10)",
        assessments: [
            { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tidak Bisa Membaca", kategori: "pengurangan", nilai: 1 },
            { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Maqro yg dibaca cuma sebagian", kategori: "pengurangan", nilai: 1 },
        ],
        expectedScore: 10,
        expectedPenalty: 90
    },
    {
        name: "50 + 0 → 50 wins (score = 50)",
        assessments: [
            { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Maqro yg dibaca cuma sebagian", kategori: "pengurangan", nilai: 1 },
            { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Video Tidak Ada Gambar", kategori: "pengurangan", nilai: 1 },
        ],
        expectedScore: 50,
        expectedPenalty: 50
    }
];

multipleTests.forEach(test => {
    const result = calculateParticipantScores(test.assessments);
    console.log(`  ${test.name}`);
    console.log(`    Score: ${result.overallScore} (Expected: ${test.expectedScore})`);
    console.log(`    Penalty: ${result.penaltyDeduction} (Expected: ${test.expectedPenalty})`);
    console.log(`    ✅ ${result.overallScore === test.expectedScore &&
                         result.penaltyDeduction === test.expectedPenalty ? 'PASS' : 'FAIL'}`);
});

console.log('\n');

// Test 6: 50 Deduction with Other Errors
console.log('TEST 6: 50 Deduction Combined with Other Category Errors');
console.log('---------------------------------------------------------');

const combined50 = [
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 1 }, // -1.5
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "خ", kategori: "makhraj", nilai: 2 }, // -3.0
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Tanaffus", kategori: "ahkam", nilai: 1 }, // -2.0
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Maqro yg dibaca cuma sebagian", kategori: "pengurangan", nilai: 1 }, // -50
];

const resultCombined = calculateParticipantScores(combined50);
console.log(`  Base deductions: Makhraj -4.5, Ahkam -2.0 = Total -6.5`);
console.log(`  Base Score: 100 - 6.5 = 93.5`);
console.log(`  After 50 Pengurangan: 93.5 - 50 = 43.5`);
console.log(`  Actual Score: ${resultCombined.overallScore}`);
console.log(`  ✅ ${resultCombined.overallScore === 43.5 ? 'PASS' : 'FAIL'}`);

console.log('\n');

// Test 7: Case Insensitivity
console.log('TEST 7: Case Insensitivity');
console.log('---------------------------');

const caseTests = [
    { huruf: "TIDAK BISA MEMBACA", expected: 10 },
    { huruf: "video rusak", expected: 0 },
    { huruf: "Maqro Yg Dibaca Cuma Sebagian", expected: 50 }
];

caseTests.forEach(test => {
    const assessments = [
        { peserta_id: "test-1", asesor_id: "asesor-1", huruf: test.huruf, kategori: "pengurangan", nilai: 1 },
    ];

    const result = calculateParticipantScores(assessments);
    console.log(`  "${test.huruf}"`);
    console.log(`    Score: ${result.overallScore} (Expected: ${test.expected})`);
    console.log(`    ✅ ${result.overallScore === test.expected ? 'PASS' : 'FAIL'}`);
});

console.log('\n');

// Test 8: Edge Cases
console.log('TEST 8: Edge Cases');
console.log('------------------');

// Nilai = 0 (no error)
const edgeCase1 = [
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Video Rusak", kategori: "pengurangan", nilai: 0 },
];
const resultEdge1 = calculateParticipantScores(edgeCase1);
console.log(`  Pengurangan with nilai = 0:`);
console.log(`    Score: ${resultEdge1.overallScore} (Expected: 100)`);
console.log(`    ✅ ${resultEdge1.overallScore === 100 ? 'PASS' : 'FAIL'}`);

// Unknown type (fallback to 90)
const edgeCase2 = [
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Unknown Type", kategori: "pengurangan", nilai: 1 },
];
const resultEdge2 = calculateParticipantScores(edgeCase2);
console.log(`  Unknown pengurangan type:`);
console.log(`    Score: ${resultEdge2.overallScore} (Expected: 10)`);
console.log(`    ✅ ${resultEdge2.overallScore === 10 ? 'PASS' : 'FAIL'}`);

// 50 deduction with very low base score
const edgeCase3 = [
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "د", kategori: "makhraj", nilai: 20 },
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "خ", kategori: "makhraj", nilai: 20 },
    { peserta_id: "test-1", asesor_id: "asesor-1", huruf: "Maqro yg dibaca cuma sebagian", kategori: "pengurangan", nilai: 1 },
];
const resultEdge3 = calculateParticipantScores(edgeCase3);
console.log(`  50 deduction with low base score:`);
console.log(`    Score: ${resultEdge3.overallScore} (Expected: >= 0)`);
console.log(`    ✅ ${resultEdge3.overallScore >= 0 ? 'PASS' : 'FAIL'}`);

console.log('\n=====================================================');
console.log('ALL GRANULAR PENGURANGAN TESTS COMPLETED!');
console.log('=====================================================');
