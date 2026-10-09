const supabase = require('../utils/supabase');

class InstructorController {
  
  async getAllInstructors(req, res) {
    try {
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) throw error;
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async createInstructor(req, res) {
    try {
      const { first_name, last_name, license_number, phone } = req.body;

      if (!first_name || !last_name || !license_number) {
        return res.status(400).json({ status: 'error', message: 'Nombre, apellido y licencia son obligatorios' });
      }

      const { data, error } = await supabase
        .from('instructors')
        .insert([{ first_name, last_name, license_number, phone }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(409).json({ status: 'error', message: 'Ya existe un instructor con esa licencia' });
        }
        throw error;
      }

      return res.status(201).json({ status: 'success', message: 'Instructor creado', data });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = new InstructorController();
