const dashboardRepository = require('../repository/dashboard.repository');

/**
 * OPTIMIZED Dashboard Use Case
 * - Uses Promise.all to run independent queries in parallel
 * - Maximizes database connection pool utilization
 * - Significantly faster than sequential execution
 */
class DashboardUseCase {
    // Get basic statistics - OPTIMIZED with parallel execution
    async getBasicStatistics() {
        // Run all independent queries in parallel for faster response
        const [totalParticipants, completedAssessments, totalAssessors, avgScore] = await Promise.all([
            dashboardRepository.getTotalParticipants(),
            dashboardRepository.getCompletedAssessments(),
            dashboardRepository.getTotalAssessors(),
            dashboardRepository.getAverageScore()
        ]);

        return {
            totalParticipants,
            completedAssessments,
            totalAssessors,
            avgScore: parseFloat(avgScore)
        };
    }

    // Get participation stats - OPTIMIZED with parallel execution
    async getParticipationStats() {
        const [byEducationLevel, byProvince] = await Promise.all([
            dashboardRepository.getParticipationByEducationLevel(),
            dashboardRepository.getParticipationByProvince()
        ]);

        return {
            byEducationLevel,
            byProvince
        };
    }

    // Get demographic data - OPTIMIZED with parallel execution
    async getDemographicData() {
        const [gender, employeeStatus, institutionType] = await Promise.all([
            dashboardRepository.getGenderDistribution(),
            dashboardRepository.getEmployeeStatusDistribution(),
            dashboardRepository.getInstitutionTypeDistribution()
        ]);

        return {
            gender,
            employeeStatus,
            institutionType
        };
    }

    // Get performance analytics - OPTIMIZED with parallel execution
    async getPerformanceAnalytics() {
        const [averageScores, provinceAchievement, fluencyLevels] = await Promise.all([
            dashboardRepository.getAverageScoresByEducationLevel(),
            dashboardRepository.getProvinceAchievementData(),
            dashboardRepository.getFluencyLevelByProvince()
        ]);

        return {
            averageScores,
            provinceAchievement,
            fluencyLevels
        };
    }

    // Get error analysis - OPTIMIZED with parallel execution
    async getErrorAnalysis() {
        const [makharij, sifat, ahkam, mad, penalties] = await Promise.all([
            dashboardRepository.getErrorStatisticsByCategory('makharij'),
            dashboardRepository.getErrorStatisticsByCategory('sifat'),
            dashboardRepository.getErrorStatisticsByCategory('ahkam'),
            dashboardRepository.getErrorStatisticsByCategory('mad'),
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
    async getProvinceData() {
        const [participation, achievement, fluency] = await Promise.all([
            dashboardRepository.getParticipationByProvince(),
            dashboardRepository.getProvinceAchievementData(),
            dashboardRepository.getFluencyLevelByProvince()
        ]);

        return {
            participation,
            achievement,
            fluency
        };
    }

    // Get comprehensive dashboard overview - OPTIMIZED with parallel execution
    async getDashboardOverview() {
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
            dashboardRepository.getTotalParticipants(),
            dashboardRepository.getCompletedAssessments(),
            dashboardRepository.getTotalAssessors(),
            dashboardRepository.getAverageScore(),
            dashboardRepository.getParticipationByEducationLevel(),
            dashboardRepository.getParticipationByProvince(),
            dashboardRepository.getGenderDistribution(),
            dashboardRepository.getEmployeeStatusDistribution(),
            dashboardRepository.getInstitutionTypeDistribution(),
            dashboardRepository.getAverageScoresByEducationLevel()
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
}

module.exports = new DashboardUseCase();
