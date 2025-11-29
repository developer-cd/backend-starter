const jwt = require('jsonwebtoken');
const config = require('../config');
const redis = require('../config/redis');
const crypto = require('crypto');

const PREFIX = 'verify:';
const EXPIRES = process.env.EMAIL_VERIFICATION_EXPIRES || '1d';

const generateVerification = async (userId) => {
  const jti = crypto.randomUUID();
  const token = jwt.sign({ id: userId }, process.env.EMAIL_VERIFICATION_SECRET || config.jwt.refreshSecret, { expiresIn: EXPIRES, jwtid: jti });
  // store token hashed for one-time use
  const hashed = token; // optionally hash
  const ttl = parseExpiryToSeconds(EXPIRES);
  await redis.set(`${PREFIX}${jti}`, userId, 'EX', ttl);
  return token;
};

const verifyToken = async (token) => {
  const payload = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET || config.jwt.refreshSecret);
  const jti = payload.jti;
  const key = `${PREFIX}${jti}`;
  const userId = await redis.get(key);
  if (!userId) throw new Error('Invalid or expired verification token');
  // delete to make one-time
  await redis.del(key);
  return payload.id || userId;
};

function parseExpiryToSeconds(exp) {
  const m = exp.match(/^(\d+)([smhd])$/);
  if (!m) return 24*3600;
  const val = parseInt(m[1], 10);
  const unit = m[2];
  switch(unit) {
    case 's': return val;
    case 'm': return val*60;
    case 'h': return val*3600;
    case 'd': return val*86400;
    default: return val;
  }
}

module.exports = { generateVerification, verifyToken };
