/**
 * Test script for scoring utility functions
 * Run this to validate the scoring calculations
 */

const { 
    calculateParticipantScores, 
    formatScoresForAPI,
    SCORING_RULES 
} = require('../utils/scoring.utils');

// Test data based on the example provided
const testAssessments = [
    // Makhraj errors (3 total)
    { kategori: 'makhraj', nilai: 0 },
    { kategori: 'makharijul_huruf', nilai: 0 },
    { kategori: 'makhraj', nilai: 0 },
    
    // Sifat errors (2 total)
    { kategori: 'sifat', nilai: 0 },
    { kategori: 'sifatul_huruf', nilai: 0 },
    
    // Ahkam - no errors
    
    // Mad errors (3 total - mixed types)
    { kategori: 'mad_wajib', nilai: 0 }, // Mad Wajib
    { kategori: 'mad_iwad', nilai: 0 },  // Mad Iwad
    { kategori: 'mad_badal', nilai: 0 }, // Mad Badal
    
    // Gharib errors (1 total)
    { kategori: 'gharib', nilai: 0 }
];

console.log('🧪 Testing Scoring System');
console.log('========================');

// Test the scoring calculation
const scoreData = calculateParticipantScores(testAssessments);
const formattedScores = formatScoresForAPI(scoreData);

console.log('📊 Calculated Scores:');
console.log('---------------------');

// Expected results based on the example:
const expectedResults = {
    makhraj: 97.0,
    sifat: 99.25,
    ahkam: 100.0,
    mad: 97.0,
    gharib: 99.0,
    overall: 98.45  // (97.0 + 99.25 + 100.0 + 97.0 + 99.0) / 5
};

Object.keys(expectedResults).forEach(category => {
    const calculated = formattedScores.scores[category];
    const expected = expectedResults[category];
    const match = Math.abs(calculated - expected) < 0.01;
    
    console.log(`${category.toUpperCase()}: ${calculated} ${match ? '✅' : '❌'} (expected: ${expected})`);
});

console.log('\n🔍 Detailed Breakdown:');
console.log('---------------------');
Object.values(scoreData.categoryScores).forEach(category => {
    console.log(`${category.category}:`);
    console.log(`  Initial Score: ${category.initialScore}`);
    console.log(`  Error Count: ${category.errorCount}`);
    console.log(`  Total Deduction: ${category.totalDeduction}`);
    console.log(`  Final Score: ${category.finalScore}`);
    console.log('');
});

console.log(`📈 Overall Score: ${scoreData.overallScore}`);
console.log(`📉 Total Deduction: ${scoreData.totalDeduction}`);

// Test edge cases
console.log('\n🧪 Testing Edge Cases:');
console.log('======================');

// Test with no assessments
const noAssessmentData = calculateParticipantScores([]);
console.log('No assessments - Overall Score:', noAssessmentData.overallScore);

// Test with only good scores
const goodAssessments = [
    { kategori: 'makhraj', nilai: 100 },
    { kategori: 'sifat', nilai: 100 }
];
const goodScoreData = calculateParticipantScores(goodAssessments);
console.log('All good assessments - Overall Score:', goodScoreData.overallScore);

console.log('\n✨ Scoring system test completed!');

module.exports = {
    testAssessments,
    expectedResults,
    runScoringTest: () => {
        return {
            calculated: formattedScores.scores,
            expected: expectedResults,
            passed: Object.keys(expectedResults).every(category => 
                Math.abs(formattedScores.scores[category] - expectedResults[category]) < 0.01
            )
        };
    }
};
