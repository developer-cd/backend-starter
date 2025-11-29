const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  roles: { type: [String], default: ['user'] },
  name: String,
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
