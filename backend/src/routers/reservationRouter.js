const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { validateCreateReservation } = require('../validators/reservationValidator');

// Ruta para listar todas las reservas (para el calendario)
router.get('/', reservationController.getAllReservations);

// Ruta para crear una reserva
// Flujo: 1. Valida el JSON (Joi) -> 2. Ejecuta el Controlador
router.post('/', validateCreateReservation, reservationController.createReservation);

module.exports = router;
