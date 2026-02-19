const User = require('./User');
const Medecin = require('./Medecin');
const Patient = require('./Patient');
const Specialite = require('./Specialite');
const RendezVous = require('./RendezVous');

// --- Associations ---
// Un User possède un profil Patient ou Medecin
User.hasOne(Patient, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Medecin, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Medecin.belongsTo(User, { foreignKey: 'user_id' });

// Le Patient et le Médecin sont liés aux Rendez-vous
Patient.hasMany(RendezVous, { foreignKey: 'patient_id' });
RendezVous.belongsTo(Patient, { foreignKey: 'patient_id' });

Medecin.hasMany(RendezVous, { foreignKey: 'medecin_id' });
RendezVous.belongsTo(Medecin, { foreignKey: 'medecin_id' });

module.exports = { User, Medecin, Patient, Specialite, RendezVous };