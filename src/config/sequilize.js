const { Sequelize } = require('sequelize');
const { sql } = require('./index');
const logger = require('../utils/logger');

const sequelize = new Sequelize(sql.database, sql.username, sql.password, {
  host: sql.host,
  port: sql.port,
  dialect: sql.dialect,
  logging: msg => logger.debug(msg)
});

const connectSql = async () => {
  await sequelize.authenticate();
  logger.info('Connected to SQL DB');
};

module.exports = { sequelize, connectSql };
