const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/sequelize');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING },
  roles: { type: DataTypes.JSON, defaultValue: ['user'] },
  isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = User;
