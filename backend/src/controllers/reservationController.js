const reservationService = require('../services/reservationService');
const supabase = require('../utils/supabase');
const { getPagination } = require('../utils/pagination');
class ReservationController {
  
  /**
   * GET /api/reservations
   * Obtiene todas las reservas con paginación
   */
  async getAllReservations(req, res, next) {
    try {
      const { page, limit } = req.query;
      const { from, to, page: currentPage, limit: currentLimit } = getPagination(page, limit);

      const { data, error, count } = await supabase
        .from('reservations')
        .select(`
          id,
          reservation_time,
          shift,
          status,
          students ( first_name, last_name ),
          instructors ( first_name, last_name ),
          vehicles ( brand, model, plate_number )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return res.status(200).json({ 
        status: 'success', 
        meta: {
          total_items: count,
          total_pages: Math.ceil(count / currentLimit),
          current_page: currentPage,
          limit: currentLimit
        },
        data 
      });
    } catch (error) {
      // Pasamos el error al Middleware Global de Errores que acabamos de crear
      next(error);
    }
  }

  /**
   * POST /api/reservations
   * Crea una nueva reserva
   */
  async createReservation(req, res) {
    try {
      // Los datos ya vienen validados gracias al middleware (Joi)
      const reservationData = req.body;
      
      const newReservation = await reservationService.createReservation(reservationData);
      
      return res.status(201).json({
        status: 'success',
        message: 'Reserva creada exitosamente',
        data: newReservation
      });
      
    } catch (error) {
      console.error('[ERROR] Controlador de Reservas:', error.message);
      
      // Si el error es el de conflicto de horarios que lanzamos desde el Service
      if (error.message.includes('Conflicto de horario')) {
        return res.status(409).json({
          status: 'error',
          message: error.message
        });
      }
      
      // Cualquier otro error del servidor
      return res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor al crear la reserva',
        detail: error.message
      });
    }
  }
}

module.exports = new ReservationController();
