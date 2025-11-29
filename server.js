const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const connectMongo = require('./config/mongoose');
const { connectSql } = require('./config/sequelize');

const start = async () => {
  try {
    await connectMongo();
    await connectSql();
    app.listen(config.port, () => {
      logger.info(`Server running on ${config.port}`);
    });
  } catch (err) {
    logger.error('Failed to start:', err);
    process.exit(1);
  }
};

start();
