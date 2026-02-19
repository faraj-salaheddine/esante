const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.get('/me', patientController.getProfile);

module.exports = router;