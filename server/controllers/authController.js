const { User } = require('../models');
const sendVerificationEmail = require('../utils/mailer');

exports.register = async (req, res) => {
  try {
    const { nom, email, password, role } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      nom, email, password, role,
      verification_code: code,
      is_verified: false
    });

    await sendVerificationEmail(email, code);
    res.status(201).json({ message: "Vérifiez votre email.", email: newUser.email });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Fonction pour valider le code entré par l'utilisateur
exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ where: { email, verification_code: code } });

  if (user) {
    user.is_verified = true;
    user.verification_code = null;
    await user.save();
    res.json({ message: "Compte vérifié !" });
  } else {
    res.status(400).json({ message: "Code invalide." });
  }
};