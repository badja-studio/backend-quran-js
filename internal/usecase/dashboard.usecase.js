const dashboardRepository = require('../repository/dashboard.repository');

class DashboardUseCase {
    // Get comprehensive dashboard data
    async getDashboardOverview() {
        try {
            const [
                basicStats,
                participationByLevel,
                participationByProvince,
                genderDistribution,
                employeeStatus,
                institutionType,
                averageScores
            ] = await Promise.all([
                dashboardRepository.getBasicStatistics(),
                dashboardRepository.getParticipationByEducationLevel(),
                dashboardRepository.getParticipationByProvince(),
                dashboardRepository.getGenderDistribution(),
                dashboardRepository.getEmployeeStatusDistribution(),
                dashboardRepository.getInstitutionTypeDistribution(),
                dashboardRepository.getAverageScoresByEducationLevel()
            ]);

            return {
                basicStats,
                participationByLevel,
                participationByProvince,
                demographics: {
                    gender: genderDistribution,
                    employeeStatus,
                    institutionType
                },
                averageScores
            };
        } catch (error) {
            throw new Error(`Failed to get dashboard overview: ${error.message}`);
        }
    }

    // Get participation statistics
    async getParticipationStats() {
        try {
            const [participationByLevel, participationByProvince] = await Promise.all([
                dashboardRepository.getParticipationByEducationLevel(),
                dashboardRepository.getParticipationByProvince()
            ]);

            return {
                byEducationLevel: participationByLevel,
                byProvince: participationByProvince
            };
        } catch (error) {
            throw new Error(`Failed to get participation stats: ${error.message}`);
        }
    }

    // Get demographic data
    async getDemographicData() {
        try {
            const [
                genderDistribution,
                employeeStatus,
                institutionType
            ] = await Promise.all([
                dashboardRepository.getGenderDistribution(),
                dashboardRepository.getEmployeeStatusDistribution(),
                dashboardRepository.getInstitutionTypeDistribution()
            ]);

            return {
                gender: genderDistribution,
                employeeStatus,
                institutionType
            };
        } catch (error) {
            throw new Error(`Failed to get demographic data: ${error.message}`);
        }
    }

    // Get performance analytics
    async getPerformanceAnalytics() {
        try {
            const [
                averageScores,
                provinceAchievement,
                fluencyLevels
            ] = await Promise.all([
                dashboardRepository.getAverageScoresByEducationLevel(),
                dashboardRepository.getProvinceAchievementData(),
                dashboardRepository.getFluencyLevelByProvince()
            ]);

            return {
                averageScores,
                provinceAchievement,
                fluencyLevels
            };
        } catch (error) {
            throw new Error(`Failed to get performance analytics: ${error.message}`);
        }
    }

    // Get error analysis data
    async getErrorAnalysis() {
        try {
            const [
                makharijErrors,
                sifatErrors,
                ahkamErrors,
                madErrors,
                penaltyStats
            ] = await Promise.all([
                dashboardRepository.getErrorStatisticsByCategory('makharij'),
                dashboardRepository.getErrorStatisticsByCategory('sifat'),
                dashboardRepository.getErrorStatisticsByCategory('ahkam'),
                dashboardRepository.getErrorStatisticsByCategory('mad'),
                dashboardRepository.getPenaltyStatistics()
            ]);

            return {
                makharij: makharijErrors,
                sifat: sifatErrors,
                ahkam: ahkamErrors,
                mad: madErrors,
                penalties: penaltyStats
            };
        } catch (error) {
            throw new Error(`Failed to get error analysis: ${error.message}`);
        }
    }

    // Get basic statistics only
    async getBasicStatistics() {
        try {
            return await dashboardRepository.getBasicStatistics();
        } catch (error) {
            throw new Error(`Failed to get basic statistics: ${error.message}`);
        }
    }

    // Get province-specific data
    async getProvinceData() {
        try {
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
        } catch (error) {
            throw new Error(`Failed to get province data: ${error.message}`);
        }
    }
}

module.exports = new DashboardUseCase();
