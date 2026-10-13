const { verifyToken } = require('../utils/security');

/**
 * Middleware para validar que la petición contenga un JWT válido en Authorization: Bearer <token>
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Acceso no autorizado: Token no proporcionado'
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, email, role, name }
    next();
  } catch (err) {
    return res.status(403).json({
      status: 'error',
      message: 'Token inválido o expirado. Inicia sesión nuevamente.'
    });
  }
};

/**
 * Middleware para autorizar roles específicos (ej. 'ADMIN', 'INSTRUCTOR')
 */
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Acceso denegado: Se requiere rol [${allowedRoles.join(' o ')}]`
      });
    }
    next();
  };
};

/**
 * Middleware opcional: si hay token lo valida y adjunta a req.user, si no, continúa como anónimo
 */
const verifyOptionalToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
  } catch (err) {
    req.user = null;
  }
  next();
};

module.exports = {
  authenticateToken,
  authorizeRole,
  verifyOptionalToken
};
