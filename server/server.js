const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// 1. Importation de TOUTES les routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const medecinRoutes = require('./routes/medecinRoutes'); 

const app = express();

// 2. Middlewares (Sécurité et lecture des données)
app.use(cors()); // Autorise ton front-end React (port 5173) à parler au back-end
app.use(express.json()); // Permet à Node.js de comprendre les données JSON envoyées par React

// 3. Définition des URLs de l'API (Endpoints)
app.use('/api/auth', authRoutes);        // Gère la connexion, l'inscription et la vérification
app.use('/api/patients', patientRoutes); // Gère le tableau de bord patient
app.use('/api/medecins', medecinRoutes); // Gère l'affichage de la liste des médecins

// 4. Port du serveur
const PORT = 5000;

// 5. Synchronisation de la base de données et lancement
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Base de données esante synchronisée avec succès');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur E-Santé en ligne sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur lors de la synchronisation de la base de données :', err);
  });