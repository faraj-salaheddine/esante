const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Inscription d'un nouvel utilisateur
router.post('/register', authController.register);

// Vérification du code reçu par email
router.post('/verify', authController.verifyCode);

// Connexion
router.post('/login', authController.login);

module.exports = router;