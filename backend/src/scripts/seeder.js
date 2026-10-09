require('dotenv').config();
const supabase = require('../utils/supabase');

const seedDatabase = async () => {
  console.log('🌱 Iniciando script de población de datos (Seeder)...');

  try {
    // 1. Insertar Vehículos
    console.log('🚗 Insertando Vehículos...');
    const { data: vehicles, error: errVehicles } = await supabase.from('vehicles').insert([
      { brand: 'Toyota', model: 'Yaris', plate_number: 'ABC-123', transmission_type: 'MANUAL' },
      { brand: 'Hyundai', model: 'Accent', plate_number: 'XYZ-987', transmission_type: 'AUTOMATIC' },
      { brand: 'Kia', model: 'Rio', plate_number: 'QWE-456', transmission_type: 'MANUAL' }
    ]).select();
    if (errVehicles) throw errVehicles;

    // 2. Insertar Instructores
    console.log('👨‍🏫 Insertando Instructores...');
    const { data: instructors, error: errInstructors } = await supabase.from('instructors').insert([
      { first_name: 'Carlos', last_name: 'Pérez', license_number: 'LIC-001', phone: '999888777' },
      { first_name: 'Ana', last_name: 'Gómez', license_number: 'LIC-002', phone: '999111222' }
    ]).select();
    if (errInstructors) throw errInstructors;

    // 3. Insertar Estudiantes
    console.log('🧑‍🎓 Insertando Estudiantes...');
    const { data: students, error: errStudents } = await supabase.from('students').insert([
      { first_name: 'Juan', last_name: 'López', document_id: '77788899', email: 'juan@test.com', phone: '911222333' },
      { first_name: 'María', last_name: 'Torres', document_id: '11122233', email: 'maria@test.com', phone: '944555666' }
    ]).select();
    if (errStudents) throw errStudents;

    // 4. Insertar una Reserva de Ejemplo (Mañana de 10am a 12pm)
    console.log('🗓️ Insertando Reserva de prueba...');
    const today = new Date();
    // Establecemos la reserva para mañana
    const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0, 0);
    const endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 12, 0, 0);
    
    // Formato requerido por PostgreSQL para tsrange: '[YYYY-MM-DD HH:MM:SS, YYYY-MM-DD HH:MM:SS)'
    const timeRange = `[${startTime.toISOString()}, ${endTime.toISOString()})`;

    const { error: errReservation } = await supabase.from('reservations').insert([{
      student_id: students[0].id,
      instructor_id: instructors[0].id,
      vehicle_id: vehicles[0].id,
      reservation_time: timeRange,
      shift: 'MORNING'
    }]);

    // Ignoramos el error si ya existe una reserva por solapamiento
    if (errReservation && errReservation.code !== '23P01') {
      throw errReservation;
    }

    console.log('✅ ¡Base de datos poblada exitosamente!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error durante el Seeder:', error.message || error);
    process.exit(1);
  }
};

seedDatabase();
