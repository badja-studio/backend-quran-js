const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const Surah = sequelize.define('Surah', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  englishName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numberOfAyahs: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  revelationType: {
    type: DataTypes.ENUM('Meccan', 'Medinan'),
    allowNull: false
  }
}, {
  tableName: 'surahs',
  timestamps: true
});

module.exports = Surah;
