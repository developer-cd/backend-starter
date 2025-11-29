const mongoose = require('mongoose');
const { mongoUri } = require('./index');
const logger = require('../utils/logger');

const connectMongo = async () => {
  if (!mongoUri) throw new Error('MONGO_URI not set');
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  logger.info('Connected to MongoDB');
};

module.exports = connectMongo;
