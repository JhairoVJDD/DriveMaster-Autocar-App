const supabase = require('../utils/supabase');

class VehicleController {
  
  // 1. OBTENER TODOS LOS VEHÍCULOS (GET)
  async getAllVehicles(req, res) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // 2. CREAR UN VEHÍCULO NUEVO (POST)
  async createVehicle(req, res) {
    try {
      const { brand, model, plate_number, transmission_type } = req.body;

      // Validar datos básicos
      if (!brand || !model || !plate_number) {
        return res.status(400).json({ status: 'error', message: 'Marca, modelo y placa son obligatorios' });
      }

      // Insertar en Supabase
      const { data, error } = await supabase
        .from('vehicles')
        .insert([{ brand, model, plate_number, transmission_type }])
        .select()
        .single();

      if (error) {
        // Manejar error si la placa ya existe (Violación de Unique Constraint en PostgreSQL)
        if (error.code === '23505') {
          return res.status(409).json({ status: 'error', message: 'Ya existe un vehículo con esa placa' });
        }
        throw error;
      }

      return res.status(201).json({ status: 'success', message: 'Vehículo registrado', data });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // 3. ACTUALIZAR ESTADO DEL VEHÍCULO (PATCH)
  async updateVehicleStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body; // Ej: 'MAINTENANCE', 'AVAILABLE'

      const { data, error } = await supabase
        .from('vehicles')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ status: 'success', message: 'Estado actualizado', data });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = new VehicleController();
