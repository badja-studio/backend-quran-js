const surahRepository = require('../repository/surah.repository');

class SurahUseCase {
  async getAllSurahs() {
    try {
      const surahs = await surahRepository.findAll();
      return {
        success: true,
        data: surahs,
        message: 'Surahs retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getAllSurahs:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve surahs',
        error: error.message
      };
    }
  }

  async getSurahById(id) {
    try {
      const surah = await surahRepository.findById(id);
      if (!surah) {
        return {
          success: false,
          data: null,
          message: 'Surah not found'
        };
      }
      return {
        success: true,
        data: surah,
        message: 'Surah retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getSurahById:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve surah',
        error: error.message
      };
    }
  }

  async getSurahByNumber(number) {
    try {
      const surah = await surahRepository.findByNumber(number);
      if (!surah) {
        return {
          success: false,
          data: null,
          message: 'Surah not found'
        };
      }
      return {
        success: true,
        data: surah,
        message: 'Surah retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getSurahByNumber:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve surah',
        error: error.message
      };
    }
  }

  async createSurah(data) {
    try {
      // Validate required fields
      if (!data.number || !data.name || !data.englishName || !data.numberOfAyahs || !data.revelationType) {
        return {
          success: false,
          data: null,
          message: 'Missing required fields'
        };
      }

      // Check if surah with same number already exists
      const existingSurah = await surahRepository.findByNumber(data.number);
      if (existingSurah) {
        return {
          success: false,
          data: null,
          message: 'Surah with this number already exists'
        };
      }

      const surah = await surahRepository.create(data);
      return {
        success: true,
        data: surah,
        message: 'Surah created successfully'
      };
    } catch (error) {
      console.error('Error in createSurah:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to create surah',
        error: error.message
      };
    }
  }

  async updateSurah(id, data) {
    try {
      const surah = await surahRepository.update(id, data);
      if (!surah) {
        return {
          success: false,
          data: null,
          message: 'Surah not found'
        };
      }
      return {
        success: true,
        data: surah,
        message: 'Surah updated successfully'
      };
    } catch (error) {
      console.error('Error in updateSurah:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to update surah',
        error: error.message
      };
    }
  }

  async deleteSurah(id) {
    try {
      const result = await surahRepository.delete(id);
      if (!result) {
        return {
          success: false,
          data: null,
          message: 'Surah not found'
        };
      }
      return {
        success: true,
        data: null,
        message: 'Surah deleted successfully'
      };
    } catch (error) {
      console.error('Error in deleteSurah:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to delete surah',
        error: error.message
      };
    }
  }
}

module.exports = new SurahUseCase();
