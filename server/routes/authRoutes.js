const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 1. Route pour s'inscrire
router.post('/register', authController.register);

// 2. Route pour se connecter
router.post('/login', authController.login);

// 3. NOUVELLE ROUTE : Obtenir les informations du Dashboard
router.get('/user/:id', authController.getUserInfo);

module.exports = router;