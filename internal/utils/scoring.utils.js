/**
 * Utility functions for calculating Quran assessment scores
 * Based on error frequency and category-specific deduction rules
 */

const SCORING_RULES = {
    MAKHRAJ: {
        initial: 100,
        firstError: 2.0,
        subsequentError: 0.5,
        categories: ['makhraj', 'makharijul_huruf', 'makharijul huruf']
    },
    SIFAT: {
        initial: 100,
        firstError: 0.5,
        subsequentError: 0.25,
        categories: ['sifat', 'sifatul_huruf', 'sifatul huruf']
    },
    AHKAM: {
        initial: 100,
        firstError: 0.5,
        subsequentError: 0.25,
        categories: ['ahkam', 'ahkamul_huruf', 'ahkamul huruf']
    },
    MAD: {
        initial: 100,
        rules: {
            // Mad Thabii/Wajib has higher penalty
            thabii: { firstError: 2.0, subsequentError: 0.5 },
            wajib: { firstError: 2.0, subsequentError: 0.5 },
            // Other Mad types
            default: { firstError: 1.0, subsequentError: 0.5 }
        },
        categories: ['mad', 'ahkamul_mad', 'ahkamul mad', 'mad_thabii', 'mad_wajib', 'mad_iwad', 'mad_badal']
    },
    GHARIB: {
        initial: 100,
        firstError: 1.0,
        subsequentError: 0.5,
        categories: ['gharib', 'kalimat_gharib', 'kalimat gharib']
    }
};

/**
 * Normalize category name to match scoring rules
 * @param {string} category - Raw category name from assessment
 * @returns {string} - Normalized category key
 */
function normalizeCategoryName(category) {
    const normalized = category.toLowerCase().trim();
    
    for (const [key, rule] of Object.entries(SCORING_RULES)) {
        if (rule.categories && rule.categories.includes(normalized)) {
            return key;
        }
    }
    
    // Default fallback - try to match partial strings
    if (normalized.includes('makhraj')) return 'MAKHRAJ';
    if (normalized.includes('sifat')) return 'SIFAT';
    if (normalized.includes('ahkam') && !normalized.includes('mad')) return 'AHKAM';
    if (normalized.includes('mad')) return 'MAD';
    if (normalized.includes('gharib')) return 'GHARIB';
    
    return 'OTHER';
}

/**
 * Calculate deduction for a specific category based on error count
 * @param {string} categoryKey - Normalized category key
 * @param {number} errorCount - Number of errors in this category
 * @param {string} madType - Specific type for Mad category (thabii, wajib, etc.)
 * @returns {number} - Total deduction points
 */
function calculateCategoryDeduction(categoryKey, errorCount, madType = 'default') {
    if (errorCount === 0) return 0;
    
    const rule = SCORING_RULES[categoryKey];
    if (!rule) return 0;
    
    let totalDeduction = 0;
    
    if (categoryKey === 'MAD') {
        // Special handling for Mad category with different sub-types
        const madRule = rule.rules[madType] || rule.rules.default;
        
        // First error
        totalDeduction += madRule.firstError;
        
        // Subsequent errors
        if (errorCount > 1) {
            totalDeduction += (errorCount - 1) * madRule.subsequentError;
        }
    } else {
        // Standard category calculation
        // First error
        totalDeduction += rule.firstError;
        
        // Subsequent errors
        if (errorCount > 1) {
            totalDeduction += (errorCount - 1) * rule.subsequentError;
        }
    }
    
    return totalDeduction;
}

/**
 * Calculate score for a single category
 * @param {string} categoryKey - Normalized category key
 * @param {number} errorCount - Number of errors in this category
 * @param {string} madType - Specific type for Mad category
 * @returns {Object} - Category score details
 */
function calculateCategoryScore(categoryKey, errorCount, madType = 'default') {
    const rule = SCORING_RULES[categoryKey];
    if (!rule) {
        return {
            category: categoryKey,
            initialScore: 100,
            errorCount: errorCount,
            totalDeduction: 0,
            finalScore: 100
        };
    }
    
    const totalDeduction = calculateCategoryDeduction(categoryKey, errorCount, madType);
    const finalScore = Math.max(0, rule.initial - totalDeduction);
    
    return {
        category: categoryKey,
        initialScore: rule.initial,
        errorCount: errorCount,
        totalDeduction: totalDeduction,
        finalScore: Number(finalScore.toFixed(2))
    };
}

/**
 * Process assessment data and calculate scores for all categories
 * @param {Array} assessments - Array of assessment records
 * @returns {Object} - Complete scoring breakdown
 */
function calculateParticipantScores(assessments) {
    // Group assessments by category and count errors
    const categoryErrors = {};
    const madTypeErrors = {};
    
    assessments.forEach(assessment => {
        const categoryKey = normalizeCategoryName(assessment.kategori);
        
        if (!categoryErrors[categoryKey]) {
            categoryErrors[categoryKey] = 0;
        }
        
        // Count as error if nilai (score) indicates mistake
        // Assuming lower scores or specific values indicate errors
        if (assessment.nilai < 100 || assessment.nilai === 0) {
            categoryErrors[categoryKey]++;
            
            // Special handling for Mad sub-types
            if (categoryKey === 'MAD') {
                const rawCategory = assessment.kategori.toLowerCase();
                let madType = 'default';
                
                if (rawCategory.includes('thabii') || rawCategory.includes('thobi')) {
                    madType = 'thabii';
                } else if (rawCategory.includes('wajib')) {
                    madType = 'wajib';
                }
                
                if (!madTypeErrors[madType]) {
                    madTypeErrors[madType] = 0;
                }
                madTypeErrors[madType]++;
            }
        }
    });
    
    // Calculate scores for each category
    const categoryScores = {};
    let totalScore = 0;
    let categoryCount = 0;
    
    // Process each main category
    Object.keys(SCORING_RULES).forEach(categoryKey => {
        const errorCount = categoryErrors[categoryKey] || 0;
        
        let categoryScore;
        if (categoryKey === 'MAD') {
            // For Mad, calculate based on the most severe sub-type
            let totalMadErrors = 0;
            let worstMadType = 'default';
            
            Object.keys(madTypeErrors).forEach(madType => {
                totalMadErrors += madTypeErrors[madType];
                if (madType === 'thabii' || madType === 'wajib') {
                    worstMadType = madType;
                }
            });
            
            categoryScore = calculateCategoryScore(categoryKey, totalMadErrors, worstMadType);
        } else {
            categoryScore = calculateCategoryScore(categoryKey, errorCount);
        }
        
        categoryScores[categoryKey] = categoryScore;
        totalScore += categoryScore.finalScore;
        categoryCount++;
    });
    
    // Calculate overall average
    const overallAverage = categoryCount > 0 ? Number((totalScore / categoryCount).toFixed(2)) : 0;
    
    return {
        categoryScores,
        overallAverage,
        totalDeduction: Object.values(categoryScores).reduce((sum, cat) => sum + cat.totalDeduction, 0),
        assessmentCount: assessments.length,
        calculatedAt: new Date().toISOString()
    };
}

/**
 * Format scores for API response
 * @param {Object} scoreData - Score calculation result
 * @returns {Object} - Formatted score data
 */
function formatScoresForAPI(scoreData) {
    const { categoryScores, overallAverage, totalDeduction, assessmentCount } = scoreData;
    
    return {
        scores: {
            makhraj: categoryScores.MAKHRAJ?.finalScore || 100,
            sifat: categoryScores.SIFAT?.finalScore || 100,
            ahkam: categoryScores.AHKAM?.finalScore || 100,
            mad: categoryScores.MAD?.finalScore || 100,
            gharib: categoryScores.GHARIB?.finalScore || 100,
            overall: overallAverage
        },
        details: {
            categoryBreakdown: categoryScores,
            totalDeduction,
            assessmentCount,
            calculatedAt: scoreData.calculatedAt
        }
    };
}

module.exports = {
    SCORING_RULES,
    normalizeCategoryName,
    calculateCategoryDeduction,
    calculateCategoryScore,
    calculateParticipantScores,
    formatScoresForAPI
};
