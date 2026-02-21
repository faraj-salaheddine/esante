const RendezVous = require('../models/RendezVous');
const Patient = require('../models/Patient');
const Medecin = require('../models/Medecin');
const User = require('../models/User');

// ==========================================
// 🔗 DÉCLARATION DES JOINTURES (Relations SQL)
// ==========================================
// Un Rendez-vous appartient à un Patient, et un Patient correspond à un User
RendezVous.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.belongsTo(User, { foreignKey: 'user_id' });

// Un Rendez-vous appartient à un Médecin, et un Médecin correspond à un User
RendezVous.belongsTo(Medecin, { foreignKey: 'medecin_id' });
Medecin.belongsTo(User, { foreignKey: 'user_id' });

// ==========================================
// (Optionnel) Ta fonction de réservation de RDV
// ==========================================
exports.bookAppointment = async (req, res) => {
  // ... ton code de réservation existant ...
};

// ==========================================
// 1. Récupérer les RDV d'un MEDECIN (avec le nom du patient)
// ==========================================
exports.getRdvsByMedecin = async (req, res) => {
  try {
    const { medecinId } = req.params;
    const rdvs = await RendezVous.findAll({ 
      where: { medecin_id: medecinId },
      include: [{
        model: Patient,
        include: [{ model: User, attributes: ['nom'] }] // 🎯 Va chercher le nom !
      }]
    });
    res.json(rdvs);
  } catch (error) {
    console.error("Erreur getRdvsByMedecin:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// 2. Mettre à jour la note secrète d'un RDV
// ==========================================
exports.updateNoteSecrete = async (req, res) => {
  try {
    const { id } = req.params;
    const { note_secrete } = req.body;
    await RendezVous.update({ note_secrete }, { where: { id: id } });
    res.json({ message: "✅ Note secrète sauvegardée dans MySQL !" });
  } catch (error) {
    console.error("Erreur updateNoteSecrete:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// 3. Récupérer les RDV d'un PATIENT (avec le nom du médecin)
// ==========================================
exports.getRdvsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const rdvs = await RendezVous.findAll({ 
      where: { patient_id: patientId },
      include: [{
        model: Medecin,
        include: [{ model: User, attributes: ['nom'] }] // 🎯 Va chercher le nom !
      }]
    });
    res.json(rdvs);
  } catch (error) {
    console.error("Erreur getRdvsByPatient:", error);
    res.status(500).json({ error: error.message });
  }
};