const verificationSvc = require('../services/verification.service');
const UserAdapter = require('../adapters/user.adapter');

const verify = async (req, res, next) => {
  try {
    const { token } = req.body; // or req.query.token if GET
    if (!token) return res.status(400).json({ message: 'No token' });
    const userId = await verificationSvc.verifyToken(token);
    await UserAdapter.markEmailVerified(userId);
    return res.json({ message: 'Email verified' });
  } catch (err) { next(err); }
};

module.exports = { verify };
