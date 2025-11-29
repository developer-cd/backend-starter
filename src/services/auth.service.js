const bcrypt = require('bcryptjs');
const UserAdapter = require('../adapters/user.adapter'); // dynamic adapter factory
const tokenService = require('./token.service');

const SALT_ROUNDS = 10;
const ROTATE = process.env.ROTATE_REFRESH_TOKENS === 'true';

const register = async ({ email, password, name }) => {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await UserAdapter.create({ email, password: hashed, name, roles: ['user'] });
  const access = tokenService.signAccessToken({ id: user.id || user._id, roles: user.roles });
  const { token: refresh, jti } = await tokenService.signRefreshToken({ id: user.id || user._id, roles: user.roles });
  const ttl = parseExpiryToSeconds(process.env.REFRESH_TOKEN_EXPIRES || '30d');
  await tokenService.storeJtiForUser(user.id || user._id, jti, ttl);
  return { user, access, refresh };
};

const login = async ({ email, password }) => {
  const user = await UserAdapter.findByEmail(email);
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Invalid credentials');
  const access = tokenService.signAccessToken({ id: user.id || user._id, roles: user.roles });
  const { token: refresh, jti } = await tokenService.signRefreshToken({ id: user.id || user._id, roles: user.roles });
  const ttl = parseExpiryToSeconds(process.env.REFRESH_TOKEN_EXPIRES || '30d');
  await tokenService.storeJtiForUser(user.id || user._id, jti, ttl);
  return { user, access, refresh };
};

const refreshTokens = async (currentRefreshToken) => {
  // verify refresh token and rotate
  const { payload, jti } = await tokenService.verifyRefreshToken(currentRefreshToken);
  const userId = payload.id;
  // revoke old
  await tokenService.revokeRefreshToken(jti);
  // issue new
  const access = tokenService.signAccessToken({ id: userId, roles: payload.roles });
  const { token: newRefresh, jti: newJti } = await tokenService.signRefreshToken({ id: userId, roles: payload.roles });
  const ttl = parseExpiryToSeconds(process.env.REFRESH_TOKEN_EXPIRES || '30d');
  await tokenService.storeJtiForUser(userId, newJti, ttl);
  return { access, refresh: newRefresh };
};

module.exports = { register, login, refreshTokens };
