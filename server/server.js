const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const medecinRoutes = require('./routes/medecinRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/medecins', medecinRoutes);

const PORT = 5000;
sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Base de données esante synchronisée');
  app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
});