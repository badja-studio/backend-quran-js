const dashboardRepository = require('../repository/dashboard.repository');

/**
 * OPTIMIZED Dashboard Use Case
 * - Uses Promise.all to run independent queries in parallel
 * - Maximizes database connection pool utilization
 * - Significantly faster than sequential execution
 */
class DashboardUseCase {
    // Get basic statistics - OPTIMIZED with parallel execution
    async getBasicStatistics(provinsi = null) {
        // Run all independent queries in parallel for faster response
        const [totalParticipants, completedAssessments, totalAssessors, avgScore] = await Promise.all([
            dashboardRepository.getTotalParticipants(provinsi),
            dashboardRepository.getCompletedAssessments(provinsi),
            dashboardRepository.getTotalAssessors(provinsi),
            dashboardRepository.getAverageScore(provinsi)
        ]);

        return {
            totalParticipants,
            completedAssessments,
            totalAssessors,
            avgScore: parseFloat(avgScore)
        };
    }

    // Get participation stats - OPTIMIZED with parallel execution
    async getParticipationStats(provinsi = null) {
        const [byEducationLevel, byProvince] = await Promise.all([
            dashboardRepository.getParticipationByEducationLevel(provinsi),
            dashboardRepository.getParticipationByProvince(provinsi)
        ]);

        return {
            byEducationLevel,
            byProvince
        };
    }

    // Get demographic data - OPTIMIZED with parallel execution
    async getDemographicData(provinsi = null) {
        const [gender, employeeStatus, institutionType] = await Promise.all([
            dashboardRepository.getGenderDistribution(provinsi),
            dashboardRepository.getEmployeeStatusDistribution(provinsi),
            dashboardRepository.getInstitutionTypeDistribution(provinsi)
        ]);

        return {
            gender,
            employeeStatus,
            institutionType
        };
    }

    // Get performance analytics - OPTIMIZED with parallel execution
    async getPerformanceAnalytics(provinsi = null) {
        const [averageScores, provinceAchievement, fluencyLevels] = await Promise.all([
            dashboardRepository.getAverageScoresByEducationLevel(provinsi),
            dashboardRepository.getProvinceAchievementData(provinsi),
            dashboardRepository.getFluencyLevelByProvince(provinsi)
        ]);

        return {
            averageScores,
            provinceAchievement,
            fluencyLevels
        };
    }

    // Get error analysis - OPTIMIZED with parallel execution
    async getErrorAnalysis(provinsi = null) {
        const [makharij, sifat, ahkam, mad, penalties] = await Promise.all([
            dashboardRepository.getErrorStatisticsByCategory('makharij', provinsi),
            dashboardRepository.getErrorStatisticsByCategory('sifat', provinsi),
            dashboardRepository.getErrorStatisticsByCategory('ahkam', provinsi),
            dashboardRepository.getErrorStatisticsByCategory('mad', provinsi),
            dashboardRepository.getPenaltyStatistics()
        ]);

        return {
            makharij,
            sifat,
            ahkam,
            mad,
            penalties
        };
    }

    // Get province data - OPTIMIZED with parallel execution
    async getProvinceData(provinsi = null) {
        const [participation, achievement, fluency] = await Promise.all([
            dashboardRepository.getParticipationByProvince(provinsi),
            dashboardRepository.getProvinceAchievementData(provinsi),
            dashboardRepository.getFluencyLevelByProvince(provinsi)
        ]);

        return {
            participation,
            achievement,
            fluency
        };
    }

    // Get comprehensive dashboard overview - OPTIMIZED with parallel execution
    async getDashboardOverview(provinsi = null) {
        // Run all independent queries in parallel for maximum performance
        const [
            totalParticipants,
            completedAssessments,
            totalAssessors,
            avgScore,
            participationByLevel,
            participationByProvince,
            gender,
            employeeStatus,
            institutionType,
            averageScores
        ] = await Promise.all([
            dashboardRepository.getTotalParticipants(provinsi),
            dashboardRepository.getCompletedAssessments(provinsi),
            dashboardRepository.getTotalAssessors(provinsi),
            dashboardRepository.getAverageScore(provinsi),
            dashboardRepository.getParticipationByEducationLevel(provinsi),
            dashboardRepository.getParticipationByProvince(provinsi),
            dashboardRepository.getGenderDistribution(provinsi),
            dashboardRepository.getEmployeeStatusDistribution(provinsi),
            dashboardRepository.getInstitutionTypeDistribution(provinsi),
            dashboardRepository.getAverageScoresByEducationLevel(provinsi)
        ]);

        return {
            basicStats: {
                totalParticipants,
                completedAssessments,
                totalAssessors,
                avgScore: parseFloat(avgScore)
            },
            participationByLevel,
            participationByProvince,
            demographics: {
                gender,
                employeeStatus,
                institutionType
            },
            averageScores
        };
    }

    // ============================================================================
    // NEW METHODS FOR SCORE DISTRIBUTION FEATURE
    // ============================================================================

    // Get list of distinct provinces
    async getProvincesList() {
        return await dashboardRepository.getProvincesList();
    }

    // Get score distribution by education level
    async getScoreDistributionByLevel(provinsi = null) {
        return await dashboardRepository.getScoreDistributionByLevel(provinsi);
    }

    // Get score distribution by subject
    async getScoreDistributionBySubject(provinsi = null) {
        return await dashboardRepository.getScoreDistributionBySubject(provinsi);
    }
}

module.exports = new DashboardUseCase();
