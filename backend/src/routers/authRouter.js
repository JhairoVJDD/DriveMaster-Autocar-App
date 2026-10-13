const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const rateLimit = require('express-rate-limit');

// Rate limiting estricto contra ataques de fuerza bruta y credential stuffing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo 10 intentos de autenticación por IP cada 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    error: 'Demasiados intentos de autenticación. Bloqueo temporal por seguridad (15 minutos).'
  }
});

// Endpoint público de inicio de sesión con protección anti-fuerza bruta
router.post('/login', authLimiter, authController.login);

// Endpoint para registrar usuarios con limitador y opcional verificación de token
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.split(' ')[1]) {
    return authenticateToken(req, res, next);
  }
  next();
};

router.post('/register', authLimiter, optionalAuth, authController.register);

// Endpoint protegido para obtener perfil a partir del token
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;
