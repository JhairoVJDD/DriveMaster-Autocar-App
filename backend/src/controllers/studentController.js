const supabase = require('../utils/supabase');

class StudentController {
  
  async getAllStudents(req, res) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async createStudent(req, res) {
    try {
      const { first_name, last_name, document_id, email, phone } = req.body;

      if (!first_name || !last_name || !document_id || !email) {
        return res.status(400).json({ status: 'error', message: 'Faltan datos obligatorios (nombre, apellido, dni/documento, email)' });
      }

      const { data, error } = await supabase
        .from('students')
        .insert([{ first_name, last_name, document_id, email, phone }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(409).json({ status: 'error', message: 'El documento o email ya está registrado' });
        }
        throw error;
      }

      return res.status(201).json({ status: 'success', message: 'Estudiante creado', data });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = new StudentController();
