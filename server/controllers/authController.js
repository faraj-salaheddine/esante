const User = require('../models/User');
const bcrypt = require('bcrypt'); // Utilisé pour crypter les mots de passe
const jwt = require('jsonwebtoken'); // Utilisé pour la connexion

// ==========================================
// 1. INSCRIPTION (Register)
// ==========================================
exports.register = async (req, res) => {
  try {
    const { nom, email, mot_de_passe, role } = req.body;
    
    // Hachage (sécurisation) du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

    // Création du compte dans MySQL
    const newUser = await User.create({
      nom,
      email,
      mot_de_passe: hashedPassword, 
      role: role || 'patient' // Si aucun rôle n'est donné, on met 'patient' par défaut
    });

    res.status(201).json({ message: "Inscription réussie", user: newUser });
  } catch (error) {
    console.error("Erreur Register:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// 2. CONNEXION (Login)
// ==========================================
exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // On vérifie si l'email existe
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // On vérifie si le mot de passe est le bon
    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe); 
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    // On crée le "pass" (Token) pour garder l'utilisateur connecté
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
// 3. NOUVEAU : RÉCUPÉRER LE PROFIL (Dashboard)
// ==========================================
exports.getUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // On va chercher l'utilisateur, mais on bloque l'envoi du mot de passe vers React par sécurité
    const user = await User.findByPk(id, {
      attributes: { exclude: ['mot_de_passe', 'password'] } 
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    console.error("Erreur getUserInfo:", error);
    res.status(500).json({ error: error.message });
  }
};