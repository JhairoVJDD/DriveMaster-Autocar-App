const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const supabase = require('./supabase');
const { hashPassword } = require('./security');

const memoryUsers = new Map();

async function initDefaultUsers() {
  const adminHash = await hashPassword('Admin123*');
  const instructorHash = await hashPassword('Profe123*');

  const defaultAdmin = {
    id: 'u-admin-01',
    email: 'admin@autocar.com',
    password_hash: adminHash,
    full_name: 'Jhairo Ventocilla (Administrador)',
    role: 'ADMIN',
    is_active: true
  };

  const defaultInstructor = {
    id: 'u-inst-01',
    email: 'carlos@autocar.com',
    password_hash: instructorHash,
    full_name: 'Carlos Pérez (Instructor)',
    role: 'INSTRUCTOR',
    is_active: true
  };

  memoryUsers.set(defaultAdmin.email, defaultAdmin);
  memoryUsers.set(defaultInstructor.email, defaultInstructor);

  try {
    await supabase.from('users').upsert([defaultAdmin, defaultInstructor], { onConflict: 'email' });
  } catch (e) {
    // Silencioso
  }
}

initDefaultUsers();

module.exports = {
  memoryUsers
};
