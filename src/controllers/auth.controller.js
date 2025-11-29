const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const { user, access, refresh } = await authService.register(req.body);
    res.status(201).json({ user, tokens: { access, refresh } });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const { user, access, refresh } = await authService.login(req.body);
    res.json({ user, tokens: { access, refresh } });
  } catch (err) { next(err); }
};
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'No refresh token' });
    const tokens = await authService.refreshTokens(refreshToken);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};
module.exports = { register, login,refresh };
