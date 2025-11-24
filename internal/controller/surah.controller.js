const surahUseCase = require('../usecase/surah.usecase');

class SurahController {
  /**
   * @swagger
   * /api/v1/surahs:
   *   get:
   *     summary: Get all surahs
   *     tags: [Surahs]
   *     responses:
   *       200:
   *         description: List of all surahs
   *       500:
   *         description: Server error
   */
  async getAllSurahs(req, res) {
    try {
      const result = await surahUseCase.getAllSurahs();
      if (result.success) {
        return res.status(200).json(result);
      }
      return res.status(500).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/v1/surahs/{id}:
   *   get:
   *     summary: Get surah by ID
   *     tags: [Surahs]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Surah ID
   *     responses:
   *       200:
   *         description: Surah details
   *       404:
   *         description: Surah not found
   *       500:
   *         description: Server error
   */
  async getSurahById(req, res) {
    try {
      const { id } = req.params;
      const result = await surahUseCase.getSurahById(id);
      if (result.success) {
        return res.status(200).json(result);
      }
      return res.status(404).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/v1/surahs/number/{number}:
   *   get:
   *     summary: Get surah by number
   *     tags: [Surahs]
   *     parameters:
   *       - in: path
   *         name: number
   *         required: true
   *         schema:
   *           type: integer
   *         description: Surah number (1-114)
   *     responses:
   *       200:
   *         description: Surah details
   *       404:
   *         description: Surah not found
   *       500:
   *         description: Server error
   */
  async getSurahByNumber(req, res) {
    try {
      const { number } = req.params;
      const result = await surahUseCase.getSurahByNumber(number);
      if (result.success) {
        return res.status(200).json(result);
      }
      return res.status(404).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/v1/surahs:
   *   post:
   *     summary: Create a new surah
   *     tags: [Surahs]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - number
   *               - name
   *               - englishName
   *               - numberOfAyahs
   *               - revelationType
   *             properties:
   *               number:
   *                 type: integer
   *               name:
   *                 type: string
   *               englishName:
   *                 type: string
   *               numberOfAyahs:
   *                 type: integer
   *               revelationType:
   *                 type: string
   *                 enum: [Meccan, Medinan]
   *     responses:
   *       201:
   *         description: Surah created successfully
   *       400:
   *         description: Invalid input
   *       500:
   *         description: Server error
   */
  async createSurah(req, res) {
    try {
      const result = await surahUseCase.createSurah(req.body);
      if (result.success) {
        return res.status(201).json(result);
      }
      return res.status(400).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/v1/surahs/{id}:
   *   put:
   *     summary: Update surah by ID
   *     tags: [Surahs]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Surah ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               number:
   *                 type: integer
   *               name:
   *                 type: string
   *               englishName:
   *                 type: string
   *               numberOfAyahs:
   *                 type: integer
   *               revelationType:
   *                 type: string
   *                 enum: [Meccan, Medinan]
   *     responses:
   *       200:
   *         description: Surah updated successfully
   *       404:
   *         description: Surah not found
   *       500:
   *         description: Server error
   */
  async updateSurah(req, res) {
    try {
      const { id } = req.params;
      const result = await surahUseCase.updateSurah(id, req.body);
      if (result.success) {
        return res.status(200).json(result);
      }
      return res.status(404).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/v1/surahs/{id}:
   *   delete:
   *     summary: Delete surah by ID
   *     tags: [Surahs]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Surah ID
   *     responses:
   *       200:
   *         description: Surah deleted successfully
   *       404:
   *         description: Surah not found
   *       500:
   *         description: Server error
   */
  async deleteSurah(req, res) {
    try {
      const { id } = req.params;
      const result = await surahUseCase.deleteSurah(id);
      if (result.success) {
        return res.status(200).json(result);
      }
      return res.status(404).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new SurahController();
