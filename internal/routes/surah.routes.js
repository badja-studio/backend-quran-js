const express = require('express');
const surahController = require('../controller/surah.controller');

const router = express.Router();

// Surah routes
router.get('/surahs', surahController.getAllSurahs.bind(surahController));
router.get('/surahs/:id', surahController.getSurahById.bind(surahController));
router.get('/surahs/number/:number', surahController.getSurahByNumber.bind(surahController));
router.post('/surahs', surahController.createSurah.bind(surahController));
router.put('/surahs/:id', surahController.updateSurah.bind(surahController));
router.delete('/surahs/:id', surahController.deleteSurah.bind(surahController));

module.exports = router;
