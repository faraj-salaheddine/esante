const User = require('./User');
const Medecin = require('./Medecin');
const Patient = require('./Patient');
const Specialite = require('./Specialite');
const RendezVous = require('./RendezVous');

// --- Associations ---
User.hasOne(Patient, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Medecin, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Medecin.belongsTo(User, { foreignKey: 'user_id' });

// ⚠️ La ligne qui crée la colonne specialite_id dans la table medecins
Specialite.hasMany(Medecin, { foreignKey: 'specialite_id' });
Medecin.belongsTo(Specialite, { foreignKey: 'specialite_id' });

// Rendez-vous
Patient.hasMany(RendezVous, { foreignKey: 'patient_id' });
RendezVous.belongsTo(Patient, { foreignKey: 'patient_id' });

Medecin.hasMany(RendezVous, { foreignKey: 'medecin_id' });
RendezVous.belongsTo(Medecin, { foreignKey: 'medecin_id' });

module.exports = { User, Medecin, Patient, Specialite, RendezVous };