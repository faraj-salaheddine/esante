const { Patient, User, RendezVous, Medecin } = require('../models');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ message: "ID utilisateur manquant" });
    }

    const patient = await Patient.findOne({
      where: { user_id: userId },
      include: [
        { model: User, attributes: ['nom', 'email'] },
        { 
          model: RendezVous, 
          include: [{ model: Medecin, include: [{ model: User, attributes: ['nom'] }] }] 
        }
      ]
    });

    if (!patient) {
      return res.status(404).json({ message: "Profil patient introuvable" });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};