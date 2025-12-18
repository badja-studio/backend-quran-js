const dashboardRepository = require('../repository/dashboard.repository');

/**
 * Simplified Dashboard Use Case
 * - No Promise.all blocking
 * - Each method returns data directly
 * - Simple, fast, no waiting for multiple queries
 */
class DashboardUseCase {
    // Get basic statistics - simple direct calls, no Promise.all
    async getBasicStatistics() {
        const totalParticipants = await dashboardRepository.getTotalParticipants();
        const completedAssessments = await dashboardRepository.getCompletedAssessments();
        const totalAssessors = await dashboardRepository.getTotalAssessors();
        const avgScore = await dashboardRepository.getAverageScore();

        return {
            totalParticipants,
            completedAssessments,
            totalAssessors,
            avgScore: parseFloat(avgScore)
        };
    }

    // Get participation stats - direct return
    async getParticipationStats() {
        const byEducationLevel = await dashboardRepository.getParticipationByEducationLevel();
        const byProvince = await dashboardRepository.getParticipationByProvince();

        return {
            byEducationLevel,
            byProvince
        };
    }

    // Get demographic data - direct return
    async getDemographicData() {
        const gender = await dashboardRepository.getGenderDistribution();
        const employeeStatus = await dashboardRepository.getEmployeeStatusDistribution();
        const institutionType = await dashboardRepository.getInstitutionTypeDistribution();

        return {
            gender,
            employeeStatus,
            institutionType
        };
    }

    // Get performance analytics - direct return
    async getPerformanceAnalytics() {
        const averageScores = await dashboardRepository.getAverageScoresByEducationLevel();
        const provinceAchievement = await dashboardRepository.getProvinceAchievementData();
        const fluencyLevels = await dashboardRepository.getFluencyLevelByProvince();

        return {
            averageScores,
            provinceAchievement,
            fluencyLevels
        };
    }

    // Get error analysis - direct return
    async getErrorAnalysis() {
        const makharij = await dashboardRepository.getErrorStatisticsByCategory('makharij');
        const sifat = await dashboardRepository.getErrorStatisticsByCategory('sifat');
        const ahkam = await dashboardRepository.getErrorStatisticsByCategory('ahkam');
        const mad = await dashboardRepository.getErrorStatisticsByCategory('mad');
        const penalties = await dashboardRepository.getPenaltyStatistics();

        return {
            makharij,
            sifat,
            ahkam,
            mad,
            penalties
        };
    }

    // Get province data - direct return
    async getProvinceData() {
        const participation = await dashboardRepository.getParticipationByProvince();
        const achievement = await dashboardRepository.getProvinceAchievementData();
        const fluency = await dashboardRepository.getFluencyLevelByProvince();

        return {
            participation,
            achievement,
            fluency
        };
    }

    // Get comprehensive dashboard overview - simple sequential calls
    async getDashboardOverview() {
        const basicStats = await this.getBasicStatistics();
        const participationByLevel = await dashboardRepository.getParticipationByEducationLevel();
        const participationByProvince = await dashboardRepository.getParticipationByProvince();
        const gender = await dashboardRepository.getGenderDistribution();
        const employeeStatus = await dashboardRepository.getEmployeeStatusDistribution();
        const institutionType = await dashboardRepository.getInstitutionTypeDistribution();
        const averageScores = await dashboardRepository.getAverageScoresByEducationLevel();

        return {
            basicStats,
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
