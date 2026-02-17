const { Medecin, User, Specialite } = require('../models');

exports.getAllMedecins = async (req, res) => {
  try {
    const medecins = await Medecin.findAll({
      include: [
        { model: User, attributes: ['nom'] },
        { model: Specialite, attributes: ['nom_specialite'] }
      ]
    });
    res.json(medecins);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};