const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 1. Route pour l'inscription (Étape 1 et 2)
router.post('/register', authController.register);

// 2. Route pour la connexion
router.post('/login', authController.login);

module.exports = router;