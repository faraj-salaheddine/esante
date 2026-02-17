const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Medecin = sequelize.define('Medecin', {
  user_id: { type: DataTypes.INTEGER },
  specialite_id: { type: DataTypes.INTEGER },
  adresse: { type: DataTypes.TEXT },
  telephone: { type: DataTypes.STRING },
  biographie: { type: DataTypes.TEXT }
}, { tableName: 'medecins', timestamps: false });

module.exports = Medecin;