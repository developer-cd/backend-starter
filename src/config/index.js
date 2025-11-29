require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:4000',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiry: process.env.ACCESS_TOKEN_EXPIRES || '15m',
    refreshExpiry: process.env.REFRESH_TOKEN_EXPIRES || '30d'
  },
  mongoUri: process.env.MONGO_URI,
  sql: {
    dialect: process.env.SQL_DIALECT || 'postgres',
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    username: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM
  },
  stripeKey: process.env.STRIPE_SECRET_KEY
};
