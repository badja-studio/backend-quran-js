const Surah = require('../models/surah.model');

class SurahRepository {
  async findAll() {
    try {
      return await Surah.findAll({
        order: [['number', 'ASC']]
      });
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Surah.findByPk(id);
    } catch (error) {
      throw error;
    }
  }

  async findByNumber(number) {
    try {
      return await Surah.findOne({
        where: { number }
      });
    } catch (error) {
      throw error;
    }
  }

  async create(data) {
    try {
      return await Surah.create(data);
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      const surah = await Surah.findByPk(id);
      if (!surah) {
        return null;
      }
      return await surah.update(data);
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const surah = await Surah.findByPk(id);
      if (!surah) {
        return null;
      }
      await surah.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new SurahRepository();
