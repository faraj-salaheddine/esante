const { User } = require('../models');
const sendVerificationEmail = require('../utils/mailer');

exports.register = async (req, res) => {
  try {
    const { nom, email, password, role } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser = await User.create({ nom, email, password, role, verification_code: code });
    await sendVerificationEmail(email, code);
    res.status(201).json({ email: newUser.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ where: { email, verification_code: code } });
    if (user) {
      user.is_verified = true;
      user.verification_code = null;
      await user.save();
      res.json({ message: "Compte activé !" });
    } else {
      res.status(400).json({ message: "Code invalide" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, password } });
    
    if (!user || !user.is_verified) {
      return res.status(401).json({ message: "Identifiants incorrects ou compte non vérifié" });
    }
    
    // On envoie le userId ici
    res.json({ 
      token: "votre-token-securise", 
      role: user.role, 
      userId: user.id, 
      nom: user.nom 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};