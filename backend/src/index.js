require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// Inicializar cliente Supabase
require('./utils/supabase');

// Inicializar usuarios por defecto
require('./utils/userStore');

const app = express();
const PORT = process.env.PORT || 4000;

app.disable('x-powered-by');

// 1. Middlewares de Seguridad
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
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' },
  xssFilter: true
}));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
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

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    error: 'Demasiadas solicitudes desde esta dirección IP. Intente nuevamente en 15 minutos.'
  }
});
app.use('/api/', apiLimiter);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(hpp());

// 2. Rutas
const authRouter = require('./routers/authRouter');
const reservationRouter = require('./routers/reservationRouter');
const vehicleRouter = require('./routers/vehicleRouter');
const instructorRouter = require('./routers/instructorRouter');
const studentRouter = require('./routers/studentRouter');

app.use('/api/auth', authRouter);
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
      aes256GcmSupport: 'READY',
      jwtAuthentication: 'ACTIVE'
    },
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// 3. Manejo de Errores
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// 4. Inicio del Servidor
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`[INFO] 🚀 Servidor de Backend-CAR escuchando en el puerto ${PORT}`);
    console.log(`[INFO] Modo: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
