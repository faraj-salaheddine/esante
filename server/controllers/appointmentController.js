const { RendezVous } = require('../models');

exports.bookAppointment = async (req, res) => {
  try {
    const { medecin_id, date_rdv, motif } = req.body;
    const patient_id = req.user.id; // Récupéré via le Token JWT du Sprint 1

    const rdv = await RendezVous.create({
      patient_id,
      medecin_id,
      date_rdv,
      motif,
      statut: 'en_attente' // Statut par défaut 
    });

    res.status(201).json({ message: "Rendez-vous réservé !", rdv });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la réservation" });
  }
};