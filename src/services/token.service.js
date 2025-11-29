const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const redis = require('../config/redis');
const config = require('../config');

const REFRESH_PREFIX = process.env.REFRESH_TOKEN_STORE_PREFIX || 'refresh:';
const SALT_ROUNDS = 10;

const signAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiry, jwtid: crypto.randomUUID() });
};

// For refresh token we'll add jti and expiry
const signRefreshToken = async (payload) => {
  const jti = crypto.randomUUID();
  const token = jwt.sign({ ...payload }, config.jwt.refreshSecret, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || config.jwt.refreshExpiry, jwtid: jti });
  // store hashed token in redis under REFRESH_PREFIX + jti
  const hashed = await bcrypt.hash(token, SALT_ROUNDS);
  const ttlSeconds = parseExpiryToSeconds(process.env.REFRESH_TOKEN_EXPIRES || config.jwt.refreshExpiry);
  await redis.set(`${REFRESH_PREFIX}${jti}`, hashed, 'EX', ttlSeconds);
  return { token, jti };
};

const verifyAccessToken = token => jwt.verify(token, config.jwt.accessSecret);
const verifyRefreshToken = async (token) => {
  // Verify signature and get jti
  const payload = jwt.verify(token, config.jwt.refreshSecret);
  const jti = payload.jti;
  if (!jti) throw new Error('Invalid refresh token (no jti)');
  const stored = await redis.get(`${REFRESH_PREFIX}${jti}`);
  if (!stored) throw new Error('Refresh token not found (may be revoked)');
  const ok = await bcrypt.compare(token, stored);
  if (!ok) {
    // token reuse detected — revoke all tokens for user (optional)
    await revokeAllUserRefreshTokens(payload.id);
    throw new Error('Refresh token reuse detected');
  }
  return { payload, jti };
};

const revokeRefreshToken = async (jti) => {
  await redis.del(`${REFRESH_PREFIX}${jti}`);
};

const revokeAllUserRefreshTokens = async (userId) => {
  // Optionally implement pattern scan and delete all `refresh:*` entries matching userId stored in value
  // Simpler: store secondary index `refresh_by_user:${userId}` list of jtis and delete them
  const key = `refresh_by_user:${userId}`;
  const jtis = await redis.smembers(key);
  if (jtis && jtis.length) {
    const keys = jtis.map(j => `${REFRESH_PREFIX}${j}`);
    await redis.del(...keys);
    await redis.del(key);
  }
};

const storeJtiForUser = async (userId, jti, ttlSeconds) => {
  const key = `refresh_by_user:${userId}`;
  await redis.sadd(key, jti);
  await redis.expire(key, ttlSeconds);
};

function parseExpiryToSeconds(exp) {
  // supports formats like "30d", "15m", "3600s"
  const m = exp.match(/^(\d+)([smhd])$/);
  if (!m) return 30*24*3600;
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

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
  storeJtiForUser
};
