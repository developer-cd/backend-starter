const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
};

module.exports = errorHandler;
