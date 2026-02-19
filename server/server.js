const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// Importation des routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes'); 

const app = express();

app.use(cors());
app.use(express.json());

// Définition des URLs de l'API
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);

const PORT = 5000;
sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Base de données esante synchronisée');
  app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
});