const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Medecin = sequelize.define('Medecin', {
  adresse: { 
    type: DataTypes.STRING 
  },
  telephone: { 
    type: DataTypes.STRING 
  }
}, {
  timestamps: false // Empêche MySQL de bloquer sur createdAt/updatedAt
});

module.exports = Medecin;