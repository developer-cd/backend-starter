const User = require('../../models/sql/user.model');

module.exports = {
  create: async (data) => {
    const u = await User.create(data);
    return u.toJSON();
  },
  findByEmail: async (email) => User.findOne({ where: { email } }),
  findById: async (id) => User.findByPk(id),
  markEmailVerified: async (id) => {
    const u = await User.findByPk(id);
    if (!u) return null;
    u.isEmailVerified = true;
    await u.save();
    return u;
  }
};
