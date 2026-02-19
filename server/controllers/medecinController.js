const { Medecin, User, Specialite } = require('../models');

exports.getAllMedecins = async (req, res) => {
  try {
    const medecins = await Medecin.findAll({
      include: [
        { model: User, attributes: ['nom', 'email'] },
        { model: Specialite, attributes: ['nom'] }
      ]
    });
    res.json(medecins);
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ error: error.message });
  }
};