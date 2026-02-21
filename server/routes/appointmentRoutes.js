const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Route pour obtenir les RDV d'un médecin spécifique
router.get('/medecin/:medecinId', appointmentController.getRdvsByMedecin);

// NOUVEAU : Route pour obtenir les RDV d'un patient spécifique
router.get('/patient/:patientId', appointmentController.getRdvsByPatient);

// Route pour modifier la note secrète d'un RDV
router.put('/:id/note', appointmentController.updateNoteSecrete);

// (Optionnel : Ta route pour réserver un RDV)
router.post('/book', appointmentController.bookAppointment);

module.exports = router;