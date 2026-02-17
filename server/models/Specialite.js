const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Specialite = sequelize.define('Specialite', {
  nom_specialite: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'specialites', timestamps: false });

module.exports = Specialite;