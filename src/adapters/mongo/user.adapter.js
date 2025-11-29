const User = require('../../models/mongo/user.model');

module.exports = {
  create: async (data) => {
    const u = await User.create(data);
    return u.toObject();
  },
  findByEmail: async (email) => User.findOne({ email }).lean(),
  findById: async (id) => User.findById(id).lean(),
  markEmailVerified: async (id) => User.findByIdAndUpdate(id, { isEmailVerified: true })
};
