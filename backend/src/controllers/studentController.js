const supabase = require('../utils/supabase');

const maskSensitiveData = (value) => {
  if (!value) return value;
  const str = String(value);
  if (str.length <= 4) return '***';
  return '*'.repeat(str.length - 4) + str.slice(-4);
};

class StudentController {
  
  async getAllStudents(req, res) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const isAdmin = req.user && req.user.role === 'ADMIN';
      const sanitizedData = (data || []).map(student => ({
        ...student,
        document_id: isAdmin ? student.document_id : maskSensitiveData(student.document_id),
        phone: isAdmin ? student.phone : maskSensitiveData(student.phone)
      }));

      return res.status(200).json({ status: 'success', data: sanitizedData });
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
