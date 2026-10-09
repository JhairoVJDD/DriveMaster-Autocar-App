const Joi = require('joi');

// Esquema de validación para la creación de una reserva
const createReservationSchema = Joi.object({
  studentId: Joi.string().uuid().required().messages({
    'string.guid': 'El studentId debe ser un UUID válido',
    'any.required': 'El studentId es obligatorio'
  }),
  instructorId: Joi.string().uuid().required().messages({
    'string.guid': 'El instructorId debe ser un UUID válido',
    'any.required': 'El instructorId es obligatorio'
  }),
  vehicleId: Joi.string().uuid().required().messages({
    'string.guid': 'El vehicleId debe ser un UUID válido',
    'any.required': 'El vehicleId es obligatorio'
  }),
  startTime: Joi.date().iso().required().messages({
    'date.format': 'El startTime debe tener un formato de fecha ISO válido (ej. 2023-10-07T10:00:00Z)',
    'any.required': 'El startTime es obligatorio'
  }),
  endTime: Joi.date().iso().min(Joi.ref('startTime')).required().messages({
    'date.min': 'El endTime debe ser posterior al startTime',
    'date.format': 'El endTime debe tener un formato de fecha ISO válido',
    'any.required': 'El endTime es obligatorio'
  }),
  shift: Joi.string().valid('MORNING', 'AFTERNOON', 'NIGHT').required().messages({
    'any.only': 'El turno (shift) debe ser MORNING, AFTERNOON o NIGHT',
    'any.required': 'El turno es obligatorio'
  })
});

// Middleware para validar el body de la petición
const validateCreateReservation = (req, res, next) => {
  const { error } = createReservationSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    // Si hay errores, extraemos los mensajes de forma amigable
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ status: 'error', errors });
  }
  
  next();
};

module.exports = {
  validateCreateReservation
};
