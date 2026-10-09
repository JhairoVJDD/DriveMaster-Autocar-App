/**
 * Middleware Global de Manejo de Errores
 * Captura cualquier excepción no controlada en la aplicación y 
 * responde con un formato JSON estándar en lugar de mostrar trazas de código al usuario o apagar el servidor.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR NO CONTROLADO] ${err.stack}`);

  const statusCode = err.statusCode || 500;
  
  // En producción, no queremos enviar el err.stack al cliente por seguridad (fuga de información)
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Error interno del servidor',
    ...( !isProduction && { stack: err.stack } ) // Solo mostramos el stack en desarrollo
  });
};

module.exports = errorHandler;
