const User = require('../models/User');
const Medecin = require('../models/Medecin'); // On importe le modèle Medecin
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ==========================================
// 1. INSCRIPTION (Register)
// ==========================================
exports.register = async (req, res) => {
  try {
   // console.log("Données reçues :", req.body);

    const { nom, email, role, specialite_id, adresse, telephone } = req.body;
    const password_brut = req.body.password || req.body.mot_de_passe;

    if (!password_brut) {
      return res.status(400).json({ error: "Le mot de passe est obligatoire." });
    }

    // 1. Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password_brut, salt);

    // 2. Création de l'utilisateur (on utilise 'password' comme demandé par ton modèle)
    const newUser = await User.create({
      nom,
      email,
      password: hashedPassword, // 🎯 Correction : Utilise 'password' pour correspondre au modèle
      role: role || 'patient'
    });

    // 3. 👨‍⚕️ SI C'EST UN MÉDECIN : On remplit aussi la table 'Medecin'
    if (role === 'medecin') {
      await Medecin.create({
        user_id: newUser.id,
        specialite_id: specialite_id,
        adresse: adresse,
        telephone: telephone
      });
    }

    res.status(201).json({ 
      message: role === 'medecin' ? "Compte médecin créé avec succès !" : "Compte patient créé !", 
      user: { id: newUser.id, nom: newUser.nom, email: newUser.email } 
    });

  } catch (error) {
    console.error("Erreur détaillée Register:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// 2. CONNEXION (Login)
// ==========================================
exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    const password_brut = req.body.password || req.body.mot_de_passe;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // On compare avec 'user.password'
    const isMatch = await bcrypt.compare(password_brut, user.password); 
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'secret_temporaire_esante', 
      { expiresIn: '1d' }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: { id: user.id, nom: user.nom, role: user.role }
    });
  } catch (error) {
    console.error("Erreur Login:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// 3. RÉCUPÉRER LE PROFIL
// ==========================================
exports.getUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] } 
    });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};