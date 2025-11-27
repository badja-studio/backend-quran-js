const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    pool: config.database.pool,
    logging: config.database.logging
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync all models
    // await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };

// For Sequelize CLI compatibility
module.exports.development = {
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  host: config.database.host,
  port: config.database.port,
  dialect: config.database.dialect
};

module.exports.production = {
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  host: config.database.host,
  port: config.database.port,
  dialect: config.database.dialect
};
