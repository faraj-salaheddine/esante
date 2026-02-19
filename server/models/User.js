const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  nom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('patient', 'medecin', 'admin'), allowNull: false },
  verification_code: { type: DataTypes.STRING(6) },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = User;