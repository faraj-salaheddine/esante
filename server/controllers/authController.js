const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Patient, Medecin } = require('../models');

// INSCRIPTION (Mise à jour pour gérer le multi-étapes)
exports.register = async (req, res) => {
  try {
    const { 
      nom, email, password, role, 
      // Données Patient
      date_naissance, sexe, groupe_sanguin,
      // Données Médecin
      specialite_id, adresse, telephone 
    } = req.body;

    // 1. Vérifier si l'email existe déjà
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: "Cet email est déjà utilisé." });

    // 2. Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Créer l'utilisateur de base
    const newUser = await User.create({
      nom, email, password: hashedPassword, role
    });

    // 4. Créer le profil spécifique selon le rôle
    if (role === 'patient') {
      await Patient.create({
        user_id: newUser.id,
        date_naissance, sexe, groupe_sanguin
      });
    } else if (role === 'medecin') {
      await Medecin.create({
        user_id: newUser.id,
        specialite_id, adresse, telephone
      });
    }

    res.status(201).json({ message: "Utilisateur créé avec succès !" });
  } catch (error) {
    console.error("Erreur Inscription:", error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
};

// CONNEXION (Reste inchangé)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect." });

    const token = jwt.sign({ id: user.id, role: user.role }, 'SECRET_KEY', { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, nom: user.nom, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};