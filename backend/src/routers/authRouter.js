const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Endpoint público de inicio de sesión
router.post('/login', authController.login);

// Endpoint para registrar usuarios (crear cuentas)
router.post('/register', authController.register);

// Endpoint protegido para obtener perfil a partir del token
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
