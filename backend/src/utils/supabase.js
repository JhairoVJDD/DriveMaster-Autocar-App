const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[ERROR] 💥 Faltan las credenciales de Supabase en el archivo .env');
  process.exit(1);
}

// Inicializar el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('[INFO] ⚡ Cliente de Supabase inicializado correctamente.');

module.exports = supabase;
