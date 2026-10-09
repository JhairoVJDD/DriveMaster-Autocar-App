const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Definir las rutas y conectarlas con el controlador
router.get('/', vehicleController.getAllVehicles);           // Listar todos
router.post('/', vehicleController.createVehicle);           // Crear nuevo
router.patch('/:id/status', vehicleController.updateVehicleStatus); // Cambiar estado a mantenimiento/disponible

module.exports = router;
