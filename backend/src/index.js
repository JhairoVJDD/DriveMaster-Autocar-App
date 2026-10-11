require('dotenv').config(); // Cargar variables de entorno

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// Supabase client initialize (verifica conexión y credenciales)
require('./utils/supabase');

// Inicializar la aplicación Express
const app = express();
const PORT = process.env.PORT || 4000;

// Desactivar cabecera que expone la tecnología del servidor
app.disable('x-powered-by');

// ==========================================
// 1. MIDDLEWARES GLOBALES DE ALTA SEGURIDAD
// ==========================================

// Helmet: Cabeceras HTTP de Seguridad Avanzadas (HSTS, CSP, X-Frame-Options, No-Sniff)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.supabase.co"]
    }
  },
  crossOriginEmbedderPolicy: false,
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' }, // Bloquea ataques de Clickjacking
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000, // 1 año de enforcing HTTPS
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true, // Bloquea manipulación de MIME Types
  referrerPolicy: { policy: 'same-origin' },
  xssFilter: true // Protección contra Cross-Site Scripting (XSS)
}));

// CORS Estricto: Control de Orígenes Permitidos
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origin (como apps móviles, Postman o curl en desarrollo)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por política CORS de seguridad'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Rate Limiting: Prevención de ataques de Fuerza Bruta y Denial of Service (DoS)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de 15 minutos
  max: 200, // Máximo 200 peticiones por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    error: 'Demasiadas solicitudes desde esta dirección IP. Intente nuevamente en 15 minutos.'
  }
});
app.use('/api/', apiLimiter);

// Límite de tamaño estricto para evitar ataques de DoS por payloads excesivos
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// HPP: Prevenir ataques de HTTP Parameter Pollution (Manipulación de parámetros)
app.use(hpp());

// ==========================================
// 2. RUTAS (Endpoints)
// ==========================================
const reservationRouter = require('./routers/reservationRouter');
const vehicleRouter = require('./routers/vehicleRouter');
const instructorRouter = require('./routers/instructorRouter');
const studentRouter = require('./routers/studentRouter');

app.use('/api/reservations', reservationRouter);
app.use('/api/vehicles', vehicleRouter);
app.use('/api/instructors', instructorRouter);
app.use('/api/students', studentRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '🚗 Backend-CAR API protegida y funcionando correctamente',
    security: {
      helmet: 'ACTIVE',
      rateLimiter: 'ACTIVE',
      parameterPollutionDefense: 'ACTIVE',
      aes256GcmSupport: 'READY'
    },
    timestamp: new Date().toISOString()
  });
});

// Ruta de fallback (404)
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ==========================================
// 3. MIDDLEWARE DE MANEJO DE ERRORES GLOBAL
// ==========================================
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// ==========================================
// 4. INICIO DE SERVIDOR
// ==========================================
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`[INFO] 🚀 Servidor de Backend-CAR escuchando en el puerto ${PORT}`);
    console.log(`[INFO] Modo: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
