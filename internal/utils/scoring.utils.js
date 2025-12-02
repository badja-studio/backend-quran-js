/**
 * Utility functions for calculating Quran assessment scores
 * Based on error frequency and category-specific deduction rules
 */

const SCORING_RULES = {
    MAKHRAJ: {
        initial: 55.5,
        percentage: 56,
        deduction: 1.5,
        categories: ['makhraj', 'makharijul_huruf', 'makharijul huruf']
    },
    SIFAT: {
        initial: 14.5,
        percentage: 15,
        deduction: 0.5,
        categories: ['sifat', 'sifatul_huruf', 'sifatul huruf', 'shifatul_huruf', 'shifatul huruf']
    },
    AHKAM: {
        initial: 8,
        percentage: 8,
        rules: {
            // Tanaffus, Izhhar, & Gunna
            tanaffus: { deduction: 2 },
            izhhar: { deduction: 1 },
            gunna: { deduction: 0.5 },
            // Other Ahkam types
            default: { deduction: 0.5 }
        },
        categories: ['ahkam', 'ahkamul_huruf', 'ahkamul huruf', 'tanaffus', 'izhhar', 'gunna']
    },
    MAD: {
        initial: 13.5,
        percentage: 14,
        rules: {
            // Mad Thabi'i & Qashr
            thabii: { deduction: 2 },
            qashr: { deduction: 2 },
            // Mad Wajib dan Lazim
            wajib: { deduction: 1 },
            lazim: { deduction: 1 },
            // Other Mad types
            default: { deduction: 0.5 }
        },
        categories: ['mad', 'ahkamul_mad', 'ahkamul mad', 'mad_thabii', 'mad_wajib', 'mad_lazim', 'mad_iwad', 'mad_badal', 'qashr']
    },
    GHARIB: {
        initial: 6,
        percentage: 6,
        deduction: 1,
        categories: ['gharib', 'kalimat_gharib', 'kalimat gharib']
    },
    KELANCARAN: {
        initial: 2.5,
        percentage: 3,
        deduction: 2.5,
        categories: ['kelancaran', 'fluency', 'lancar']
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
    if (normalized.includes('sifat') || normalized.includes('shifat')) return 'SIFAT';
    if (normalized.includes('ahkam') && !normalized.includes('mad')) return 'AHKAM';
    if (normalized.includes('mad')) return 'MAD';
    if (normalized.includes('gharib')) return 'GHARIB';
    if (normalized.includes('kelancaran') || normalized.includes('lancar') || normalized.includes('fluency')) return 'KELANCARAN';
    
    return 'OTHER';
}

/**
 * Calculate deduction for a specific category based on error count
 * @param {string} categoryKey - Normalized category key
 * @param {number} errorCount - Number of errors in this category
 * @param {string} subType - Specific sub-type for categories with rules (AHKAM, MAD)
 * @returns {number} - Total deduction points
 */
function calculateCategoryDeduction(categoryKey, errorCount, subType = 'default') {
    if (errorCount === 0) return 0;
    
    const rule = SCORING_RULES[categoryKey];
    if (!rule) return 0;
    
    let deductionPerError = 0;
    
    if (rule.rules) {
        // Categories with sub-type rules (AHKAM, MAD)
        const subRule = rule.rules[subType] || rule.rules.default;
        deductionPerError = subRule.deduction;
    } else {
        // Simple categories with single deduction value
        deductionPerError = rule.deduction;
    }
    
    // Total deduction = error count × deduction per error
    const totalDeduction = errorCount * deductionPerError;
    
    return totalDeduction;
}

/**
 * Calculate score for a single category
 * @param {string} categoryKey - Normalized category key
 * @param {number} errorCount - Number of errors in this category
 * @param {string} subType - Specific sub-type for categories with rules (AHKAM, MAD)
 * @returns {Object} - Category score details
 */
function calculateCategoryScore(categoryKey, errorCount, subType = 'default') {
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
    
    const totalDeduction = calculateCategoryDeduction(categoryKey, errorCount, subType);
    const finalScore = Math.max(0, rule.initial - totalDeduction);
    
    return {
        category: categoryKey,
        initialScore: rule.initial,
        percentage: rule.percentage,
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
    const ahkamTypeErrors = {};
    
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
                } else if (rawCategory.includes('qashr')) {
                    madType = 'qashr';
                } else if (rawCategory.includes('wajib')) {
                    madType = 'wajib';
                } else if (rawCategory.includes('lazim')) {
                    madType = 'lazim';
                }
                
                if (!madTypeErrors[madType]) {
                    madTypeErrors[madType] = 0;
                }
                madTypeErrors[madType]++;
            }
            
            // Special handling for Ahkam sub-types
            if (categoryKey === 'AHKAM') {
                const rawCategory = assessment.kategori.toLowerCase();
                let ahkamType = 'default';
                
                if (rawCategory.includes('tanaffus')) {
                    ahkamType = 'tanaffus';
                } else if (rawCategory.includes('izhhar') || rawCategory.includes('izhar')) {
                    ahkamType = 'izhhar';
                } else if (rawCategory.includes('gunna') || rawCategory.includes('ghunna')) {
                    ahkamType = 'gunna';
                }
                
                if (!ahkamTypeErrors[ahkamType]) {
                    ahkamTypeErrors[ahkamType] = 0;
                }
                ahkamTypeErrors[ahkamType]++;
            }
        }
    });
    
    // Calculate scores for each category
    const categoryScores = {};
    let totalScore = 0;
    
    // Process each main category
    Object.keys(SCORING_RULES).forEach(categoryKey => {
        const errorCount = categoryErrors[categoryKey] || 0;
        
        let categoryScore;
        
        if (categoryKey === 'MAD') {
            // For Mad, calculate based on the most severe sub-type
            let totalMadErrors = 0;
            let worstMadType = 'default';
            let maxDeduction = 0;
            
            Object.keys(madTypeErrors).forEach(madType => {
                const errors = madTypeErrors[madType];
                totalMadErrors += errors;
                
                // Find the sub-type with highest deduction
                const rule = SCORING_RULES.MAD.rules[madType] || SCORING_RULES.MAD.rules.default;
                const deduction = rule.deduction;
                
                if (deduction > maxDeduction) {
                    maxDeduction = deduction;
                    worstMadType = madType;
                }
            });
            
            categoryScore = calculateCategoryScore(categoryKey, totalMadErrors, worstMadType);
        } else if (categoryKey === 'AHKAM') {
            // For Ahkam, calculate based on the most severe sub-type
            let totalAhkamErrors = 0;
            let worstAhkamType = 'default';
            let maxDeduction = 0;
            
            Object.keys(ahkamTypeErrors).forEach(ahkamType => {
                const errors = ahkamTypeErrors[ahkamType];
                totalAhkamErrors += errors;
                
                // Find the sub-type with highest deduction
                const rule = SCORING_RULES.AHKAM.rules[ahkamType] || SCORING_RULES.AHKAM.rules.default;
                const deduction = rule.deduction;
                
                if (deduction > maxDeduction) {
                    maxDeduction = deduction;
                    worstAhkamType = ahkamType;
                }
            });
            
            categoryScore = calculateCategoryScore(categoryKey, totalAhkamErrors, worstAhkamType);
        } else {
            categoryScore = calculateCategoryScore(categoryKey, errorCount);
        }
        
        categoryScores[categoryKey] = categoryScore;
        totalScore += categoryScore.finalScore;
    });
    
    // Overall score is now the sum of all categories (should total to 100 max)
    const overallScore = Number(totalScore.toFixed(2));
    
    return {
        categoryScores,
        overallScore,
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
    const { categoryScores, overallScore, totalDeduction, assessmentCount } = scoreData;
    
    // Default overall score is 100 (sum of all initial values) when no assessments
    const defaultOverall = 55.5 + 14.5 + 8 + 13.5 + 6 + 2.5; // = 100
    
    return {
        scores: {
            makhraj: categoryScores.MAKHRAJ?.finalScore ?? 55.5,
            sifat: categoryScores.SIFAT?.finalScore ?? 14.5,
            ahkam: categoryScores.AHKAM?.finalScore ?? 8,
            mad: categoryScores.MAD?.finalScore ?? 13.5,
            gharib: categoryScores.GHARIB?.finalScore ?? 6,
            kelancaran: categoryScores.KELANCARAN?.finalScore ?? 2.5,
            overall: overallScore ?? defaultOverall
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
