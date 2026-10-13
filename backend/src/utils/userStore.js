const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const supabase = require('./supabase');
const { hashPassword } = require('./security');

const memoryUsers = new Map();

async function initDefaultUsers() {
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@autocar.com';
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin123*';
  const instructorEmail = process.env.INSTRUCTOR_DEFAULT_EMAIL || 'carlos@autocar.com';
  const instructorPassword = process.env.INSTRUCTOR_DEFAULT_PASSWORD || 'Profe123*';

  const adminHash = await hashPassword(adminPassword);
  const instructorHash = await hashPassword(instructorPassword);

  const defaultAdmin = {
    id: 'u-admin-01',
    email: adminEmail,
    password_hash: adminHash,
    full_name: 'Administrador DriveMaster',
    role: 'ADMIN',
    is_active: true
  };

  const defaultInstructor = {
    id: 'u-inst-01',
    email: instructorEmail,
    password_hash: instructorHash,
    full_name: 'Instructor DriveMaster',
    role: 'INSTRUCTOR',
    is_active: true
  };

  memoryUsers.set(defaultAdmin.email, defaultAdmin);
  memoryUsers.set(defaultInstructor.email, defaultInstructor);

  // Solo sincronizar con Supabase si está explícitamente activado para evitar sobreescribir usuarios en producción
  if (process.env.SYNC_DEFAULT_USERS === 'true') {
    try {
      await supabase.from('users').upsert([defaultAdmin, defaultInstructor], { onConflict: 'email' });
    } catch (e) {
      // Silencioso
    }
  }
}

initDefaultUsers();

module.exports = {
  memoryUsers
};
