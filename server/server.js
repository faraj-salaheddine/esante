require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db'); 

const app = express();

app.use(cors());
app.use(express.json()); 

// ==========================================
// DÉCLARATION DES ROUTES
// ==========================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/medecins', require('./routes/medecinRoutes'));
app.use('/api/favoris', require('./routes/favoriRoutes'));

// ⚠️ LES DEUX NOUVELLES ROUTES SONT LÀ :
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/absences', require('./routes/absenceRoutes'));


// ==========================================
// DÉMARRAGE
// ==========================================
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }) 
  .then(() => {
    console.log("✅ Base de données MySQL synchronisée avec succès !");
    app.listen(PORT, () => console.log(`🚀 Serveur E-Santé démarré sur le port ${PORT}`));
  })
  .catch((error) => console.error("❌ Erreur fatale :", error));