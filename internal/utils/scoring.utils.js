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
        categories: ['ahkam', 'ahkamul_huruf', 'ahkamul huruf', 'tanaffus', 'izhhar', 'gunna', "ikhfa'", 'ikhfa']
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
        categories: ['gharib', 'kalimat_gharib', 'kalimat gharib', 'iysmam', 'badal']
    },
    KELANCARAN: {
        initial: 2.5,
        percentage: 3,
        deduction: 2.5,
        categories: ['kelancaran', 'fluency', 'lancar', 'tidak lancar', 'kurang lancar']
    },
    PENGURANGAN: {
        initial: 0,
        percentage: 0,
        deduction: 100, // Heavy penalty for complete inability
        categories: ['pengurangan', 'penalty', 'tidak bisa membaca', 'tidak bisa']
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
    
    // Calculate raw deduction
    const rawDeduction = calculateCategoryDeduction(categoryKey, errorCount, subType);
    
    // Cap deduction at initial score (can't deduct more than the initial value)
    const totalDeduction = Math.min(rawDeduction, rule.initial);
    
    // Calculate final score (will be 0 if deduction >= initial)
    const finalScore = Math.max(0, rule.initial - totalDeduction);
    
    return {
        category: categoryKey,
        initialScore: rule.initial,
        percentage: rule.percentage,
        errorCount: errorCount,
        totalDeduction: Number(totalDeduction.toFixed(2)),
        finalScore: Number(finalScore.toFixed(2))
    };
}

/**
 * Calculate deduction for a category based on errors and item count
 * Ensures fair distribution: maxDeduction per item = categoryInitialScore / itemCount
 * Each item's deduction is capped at maxDeductionPerItem
 * @param {string} categoryKey - Normalized category key
 * @param {Array} items - Array of items with their error values
 * @param {number} itemCount - Number of items in this category
 * @param {string} subType - Specific sub-type for categories with rules (AHKAM, MAD)
 * @returns {number} - Total deduction points
 */
function calculateCategoryDeductionNew(categoryKey, items, itemCount, subType = 'default') {
    if (!items || items.length === 0 || itemCount === 0) return 0;
    
    const rule = SCORING_RULES[categoryKey];
    if (!rule) return 0;
    
    // Calculate max deduction per item for fair distribution
    const maxDeductionPerItem = rule.initial / itemCount;
    
    // Get the standard deduction rate
    let standardDeductionPerError = 0;
    if (rule.rules) {
        const subRule = rule.rules[subType] || rule.rules.default;
        standardDeductionPerError = subRule.deduction;
    } else {
        standardDeductionPerError = rule.deduction;
    }
    
    // Calculate deduction per item, capped at maxDeductionPerItem
    let totalDeduction = 0;
    items.forEach(item => {
        const itemErrors = parseInt(item.errors) || 0;
        const rawItemDeduction = itemErrors * standardDeductionPerError;
        
        // Cap each item's deduction at maxDeductionPerItem
        const cappedItemDeduction = Math.min(rawItemDeduction, maxDeductionPerItem);
        totalDeduction += cappedItemDeduction;
    });
    
    // Final cap at category maximum (safety net)
    return Math.min(totalDeduction, rule.initial);
}

/**
 * Process assessment data and calculate scores for all categories
 * @param {Array} assessments - Array of assessment records
 * @returns {Object} - Complete scoring breakdown
 */
function calculateParticipantScores(assessments) {
    // Group assessments by category and count items + errors
    const categoryData = {};
    const madTypeData = {};
    const ahkamTypeData = {};
    
    assessments.forEach(assessment => {
        const categoryKey = normalizeCategoryName(assessment.kategori);
        
        // Initialize category data structure
        if (!categoryData[categoryKey]) {
            categoryData[categoryKey] = {
                itemCount: 0,
                totalErrors: 0,
                items: []
            };
        }
        
        // Increment item count for this category
        categoryData[categoryKey].itemCount++;
        
        // nilai represents the number of errors for this item (nilai = 0 means no error)
        const errorValue = parseInt(assessment.nilai) || 0;
        categoryData[categoryKey].totalErrors += errorValue;
        categoryData[categoryKey].items.push({
            huruf: assessment.huruf,
            errors: errorValue
        });
        
        // Special handling for Mad sub-types
        if (categoryKey === 'MAD') {
            const rawHuruf = (assessment.huruf || '').toLowerCase();
            const rawCategory = (assessment.kategori || '').toLowerCase();
            let madType = 'default';
            
            // Check both huruf and kategori for sub-type detection
            const combined = (rawHuruf + ' ' + rawCategory).toLowerCase();
            
            if (combined.includes('thabii') || combined.includes('thabi') || combined.includes('thobi')) {
                madType = 'thabii';
            } else if (combined.includes('qashr')) {
                madType = 'qashr';
            } else if (combined.includes('wajib')) {
                madType = 'wajib';
            } else if (combined.includes('lazim')) {
                madType = 'lazim';
            }
            
            if (!madTypeData[madType]) {
                madTypeData[madType] = { itemCount: 0, totalErrors: 0, items: [] };
            }
            madTypeData[madType].itemCount++;
            madTypeData[madType].totalErrors += errorValue;
            madTypeData[madType].items.push({
                huruf: assessment.huruf,
                errors: errorValue
            });
        }
        
        // Special handling for Ahkam sub-types
        if (categoryKey === 'AHKAM') {
            const rawHuruf = (assessment.huruf || '').toLowerCase();
            const rawCategory = (assessment.kategori || '').toLowerCase();
            let ahkamType = 'default';
            
            // Check both huruf and kategori for sub-type detection
            const combined = (rawHuruf + ' ' + rawCategory).toLowerCase();
            
            if (combined.includes('tanaffus')) {
                ahkamType = 'tanaffus';
            } else if (combined.includes('izhhar') || combined.includes('izhar')) {
                ahkamType = 'izhhar';
            } else if (combined.includes('gunna') || combined.includes('ghunna')) {
                ahkamType = 'gunna';
            }
            
            if (!ahkamTypeData[ahkamType]) {
                ahkamTypeData[ahkamType] = { itemCount: 0, totalErrors: 0, items: [] };
            }
            ahkamTypeData[ahkamType].itemCount++;
            ahkamTypeData[ahkamType].totalErrors += errorValue;
            ahkamTypeData[ahkamType].items.push({
                huruf: assessment.huruf,
                errors: errorValue
            });
        }
    });
    
    // Calculate scores for each category
    const categoryScores = {};
    let totalScore = 0;
    let penaltyDeduction = 0; // For PENGURANGAN category
    
    // Process each main category
    Object.keys(SCORING_RULES).forEach(categoryKey => {
        const catData = categoryData[categoryKey] || { itemCount: 0, totalErrors: 0 };
        const rule = SCORING_RULES[categoryKey];
        
        let totalDeduction = 0;
        let finalScore = rule.initial;
        
        if (catData.itemCount > 0) {
            // Special handling for PENGURANGAN category
            if (categoryKey === 'PENGURANGAN') {
                // PENGURANGAN affects the overall score, not a specific category
                // Each error in PENGURANGAN category deducts from the total
                const maxDeductionPerItem = 100 / catData.itemCount; // Max penalty distributed
                const rawDeduction = catData.totalErrors * rule.deduction;
                penaltyDeduction = Math.min(rawDeduction, maxDeductionPerItem * catData.itemCount);
                
                categoryScores[categoryKey] = {
                    category: categoryKey,
                    initialScore: 0,
                    percentage: 0,
                    itemCount: catData.itemCount,
                    totalErrors: catData.totalErrors,
                    totalDeduction: Number(penaltyDeduction.toFixed(2)),
                    finalScore: 0,
                    isPenalty: true
                };
                return; // Skip adding to totalScore
            }
            
            // Calculate max deduction per item to ensure fairness
            const maxDeductionPerItem = rule.initial / catData.itemCount;
            
            if (categoryKey === 'MAD' && Object.keys(madTypeData).length > 0) {
                // For Mad, calculate deduction per item with capping
                Object.keys(madTypeData).forEach(madType => {
                    const typeData = madTypeData[madType];
                    const subRule = SCORING_RULES.MAD.rules[madType] || SCORING_RULES.MAD.rules.default;
                    
                    // Calculate deduction per item, capped
                    typeData.items.forEach(item => {
                        const itemErrors = parseInt(item.errors) || 0;
                        const rawItemDeduction = itemErrors * subRule.deduction;
                        const cappedItemDeduction = Math.min(rawItemDeduction, maxDeductionPerItem);
                        totalDeduction += cappedItemDeduction;
                    });
                });
                
                // Cap total deduction at category initial score
                totalDeduction = Math.min(totalDeduction, rule.initial);
            } else if (categoryKey === 'AHKAM' && Object.keys(ahkamTypeData).length > 0) {
                // For Ahkam, calculate deduction per item with capping
                Object.keys(ahkamTypeData).forEach(ahkamType => {
                    const typeData = ahkamTypeData[ahkamType];
                    const subRule = SCORING_RULES.AHKAM.rules[ahkamType] || SCORING_RULES.AHKAM.rules.default;
                    
                    // Calculate deduction per item, capped
                    typeData.items.forEach(item => {
                        const itemErrors = parseInt(item.errors) || 0;
                        const rawItemDeduction = itemErrors * subRule.deduction;
                        const cappedItemDeduction = Math.min(rawItemDeduction, maxDeductionPerItem);
                        totalDeduction += cappedItemDeduction;
                    });
                });
                
                // Cap total deduction at category initial score
                totalDeduction = Math.min(totalDeduction, rule.initial);
            } else {
                // Simple categories - calculate deduction with per-item fairness cap
                totalDeduction = calculateCategoryDeductionNew(
                    categoryKey, 
                    catData.items,
                    catData.itemCount
                );
            }
            
            finalScore = Math.max(0, rule.initial - totalDeduction);
        }
        
        categoryScores[categoryKey] = {
            category: categoryKey,
            initialScore: rule.initial,
            percentage: rule.percentage,
            itemCount: catData.itemCount,
            totalErrors: catData.totalErrors,
            totalDeduction: Number(totalDeduction.toFixed(2)),
            finalScore: Number(finalScore.toFixed(2))
        };
        
        totalScore += finalScore;
    });
    
    // Apply penalty deduction to overall score
    const overallScore = Math.max(0, Number((totalScore - penaltyDeduction).toFixed(2)));
    
    return {
        categoryScores,
        overallScore,
        totalDeduction: Object.values(categoryScores).reduce((sum, cat) => sum + cat.totalDeduction, 0),
        penaltyDeduction: Number(penaltyDeduction.toFixed(2)),
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
    calculateCategoryDeductionNew,
    calculateCategoryScore,
    calculateParticipantScores,
    formatScoresForAPI
};
