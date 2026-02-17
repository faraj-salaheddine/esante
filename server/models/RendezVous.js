const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RendezVous = sequelize.define('RendezVous', {
  date_rdv: {
    type: DataTypes.DATE,
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'confirme', 'annule'),
    defaultValue: 'en_attente'
  },
  motif: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'rendez_vous',
  timestamps: true
});

module.exports = RendezVous;