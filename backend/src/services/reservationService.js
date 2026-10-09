// src/services/reservationService.js
const supabase = require('../utils/supabase');

class ReservationService {
  
  /**
   * Crea una nueva reserva usando Supabase.
   * Gracias a la base de datos PostgreSQL, no necesitamos hacer la comprobación previa.
   * Si hay un cruce de horarios, Supabase rechazará la inserción y lanzará un error.
   */
  async createReservation(reservationData) {
    const { studentId, instructorId, vehicleId, startTime, endTime, shift } = reservationData;

    if (new Date(startTime) >= new Date(endTime)) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin.');
    }

    // En PostgreSQL de Supabase, 'reservation_time' espera un string de rango: '[2023-01-01 10:00, 2023-01-01 11:00)'
    const timeRange = `[${startTime}, ${endTime})`;

    // Insertar directamente. Si el vehículo está ocupado en ese rango, 
    // el "Exclusion Constraint" de Postgres lanzará un error que atrapamos aquí.
    const { data, error } = await supabase
      .from('reservations')
      .insert([
        {
          student_id: studentId,
          instructor_id: instructorId,
          vehicle_id: vehicleId,
          reservation_time: timeRange,
          shift, // Guardamos el turno en la BD
          status: 'CONFIRMED'
        }
      ])
      .select()
      .single();

    if (error) {
      // Manejar el error específico de cruce de horarios (Constraint violation)
      if (error.code === '23P01') { // Código de PostgreSQL para constraint de exclusión
        throw new Error('Conflicto de horario: El vehículo ya se encuentra reservado en ese momento exacto.');
      }
      throw new Error(`Error al crear la reserva: ${error.message}`);
    }

    console.log(`[EXITO] Reserva creada: ${data.id}`);
    return data;
  }
}

module.exports = new ReservationService();
