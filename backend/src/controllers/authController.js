const supabase = require('../utils/supabase');
const { hashPassword, verifyPassword, generateToken } = require('../utils/security');
const { memoryUsers } = require('../utils/userStore');

class AuthController {

  /**
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Email y contraseña son obligatorios' 
        });
      }

      const normalizedEmail = email.trim().toLowerCase();
      let user = null;

      // 1. Intentar buscar en Supabase
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', normalizedEmail)
          .maybeSingle();
        
        if (!error && data) {
          user = data;
        }
      } catch (err) {
        // Fallback a memoria si la tabla users no está creada
      }

      // 2. Si no está en Supabase o falló, buscar en memoria
      if (!user && memoryUsers.has(normalizedEmail)) {
        user = memoryUsers.get(normalizedEmail);
      }

      if (!user) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'Credenciales inválidas. Verifica tu correo y contraseña.' 
        });
      }

      if (!user.is_active) {
        return res.status(403).json({ 
          status: 'error', 
          message: 'Tu cuenta ha sido desactivada. Consulta con el Administrador.' 
        });
      }

      // 3. Verificar contraseña contra bcrypt
      const isMatch = await verifyPassword(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'Credenciales inválidas. Verifica tu correo y contraseña.' 
        });
      }

      // 4. Generar JWT firmado
      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role
      });

      return res.status(200).json({
        status: 'success',
        message: 'Sesión iniciada con éxito',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.full_name,
            role: user.role
          }
        }
      });
    } catch (err) {
      console.error('[AUTH LOGIN ERROR]:', err);
      return res.status(500).json({ status: 'error', message: 'Error interno en autenticación' });
    }
  }

  /**
   * POST /api/auth/register
   */
  async register(req, res) {
    try {
      const { email, password, full_name, role } = req.body;

      if (!email || !password || !full_name) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Email, contraseña y nombre completo son obligatorios' 
        });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const assignedRole = ['ADMIN', 'INSTRUCTOR', 'STUDENT'].includes(role) ? role : 'INSTRUCTOR';
      const password_hash = await hashPassword(password);

      const newUser = {
        id: 'u-' + Date.now(),
        email: normalizedEmail,
        password_hash,
        full_name,
        role: assignedRole,
        is_active: true
      };

      // Guardar en memoria
      memoryUsers.set(normalizedEmail, newUser);

      // Intentar persistir en Supabase
      try {
        await supabase.from('users').insert([{
          email: normalizedEmail,
          password_hash,
          full_name,
          role: assignedRole,
          is_active: true
        }]);
      } catch (e) {
        // Ignorar si la tabla users aún no existe en Supabase
      }

      return res.status(201).json({
        status: 'success',
        message: 'Usuario registrado exitosamente',
        data: {
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role
        }
      });
    } catch (err) {
      console.error('[AUTH REGISTER ERROR]:', err);
      return res.status(500).json({ status: 'error', message: 'Error al registrar usuario' });
    }
  }

  /**
   * GET /api/auth/profile
   */
  async getProfile(req, res) {
    return res.status(200).json({
      status: 'success',
      data: req.user
    });
  }
}

module.exports = new AuthController();
