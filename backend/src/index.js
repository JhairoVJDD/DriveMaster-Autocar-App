require('dotenv').config(); // Cargar variables de entorno

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// Supabase client initialize (opcional, solo para comprobar que no falten envs)
require('./utils/supabase');

// Inicializar la aplicación Express
const app = express();
const PORT = process.env.PORT || 4000;

// ==========================================
// 1. MIDDLEWARES GLOBALES (Seguridad y Parseo)
// ==========================================

// Helmet ayuda a proteger la aplicación estableciendo varias cabeceras HTTP de seguridad.
app.use(helmet());

// Habilitar CORS para permitir peticiones desde el Frontend
app.use(cors());

// Parseador de JSON (reemplaza a body-parser). Límite de 1mb para prevenir ataques DOS de payloads gigantes.
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

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
    message: '🚗 Backend-CAR API funcionando correctamente',
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
// Se debe colocar SIEMPRE al final de todas las rutas
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// ==========================================
// 4. INICIO DE SERVIDOR Y BASE DE DATOS
// ==========================================

const startServer = () => {
  // Con Supabase (REST API base) no necesitamos mantener una conexión web socket persistente obligatoria para levantar el servidor
  app.listen(PORT, () => {
    console.log(`[INFO] 🚀 Servidor de Backend-CAR escuchando en el puerto ${PORT}`);
    console.log(`[INFO] Modo: ${process.env.NODE_ENV}`);
  });
};

startServer();
