const User = require('./User');
const Medecin = require('./Medecin');
const Patient = require('./Patient'); // On importe le nouveau modèle
const Specialite = require('./Specialite');
const RendezVous = require('./RendezVous');

// --- Relations Profils ---
// Un User possède un profil Patient (si role = 'patient')
User.hasOne(Patient, { foreignKey: 'user_id' });
Patient.belongsTo(User, { foreignKey: 'user_id' });

// Un User possède un profil Medecin (si role = 'medecin')
User.hasOne(Medecin, { foreignKey: 'user_id' });
Medecin.belongsTo(User, { foreignKey: 'user_id' });

// --- Relations Métier ---
// Un Médecin a une Spécialité
Medecin.belongsTo(Specialite, { foreignKey: 'specialite_id' });
Specialite.hasMany(Medecin, { foreignKey: 'specialite_id' });

// Un Rendez-vous lie un Patient et un Médecin
Patient.hasMany(RendezVous, { foreignKey: 'patient_id' });
RendezVous.belongsTo(Patient, { foreignKey: 'patient_id' });

Medecin.hasMany(RendezVous, { foreignKey: 'medecin_id' });
RendezVous.belongsTo(Medecin, { foreignKey: 'medecin_id' });

module.exports = { User, Medecin, Patient, Specialite, RendezVous };