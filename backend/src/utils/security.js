const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Algoritmo de cifrado AES-256-GCM
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_ROUNDS = 12;

// Secreto para JWT
const JWT_SECRET = process.env.JWT_SECRET || process.env.ENCRYPTION_SECRET || 'jwt-drivemaster-secret-key-99281-2026';
const JWT_EXPIRES_IN = '8h';

const getMasterKey = () => {
  const secret = process.env.ENCRYPTION_SECRET || process.env.SUPABASE_KEY || 'default-secure-fallback-driving-school-key-32b!';
  return crypto.createHash('sha256').update(String(secret)).digest();
};

/**
 * Encripta un texto sensible (DNI, teléfonos) usando AES-256-GCM
 */
const encrypt = (text) => {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getMasterKey(), iv);
    
    let encrypted = cipher.update(String(text), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (err) {
    console.error('[SECURITY ERROR] Fallo al encriptar:', err.message);
    throw new Error('Error al proteger datos sensibles');
  }
};

/**
 * Desencripta texto con AES-256-GCM
 */
const decrypt = (encryptedString) => {
  if (!encryptedString || !encryptedString.includes(':')) return encryptedString;
  try {
    const parts = encryptedString.split(':');
    if (parts.length !== 3) return encryptedString;

    const [ivHex, authTagHex, encryptedText] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, getMasterKey(), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('[SECURITY ERROR] Fallo al desencriptar:', err.message);
    throw new Error('Integridad de datos violada o llave inválida');
  }
};

/**
 * Hash seguro de contraseña con bcrypt (12 rounds)
 */
const hashPassword = async (password) => {
  if (!password) throw new Error('Contraseña requerida');
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Valida contraseña contra hash
 */
const verifyPassword = async (password, hash) => {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
};

/**
 * Genera token JWT firmado con rol y usuario
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifica token JWT
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  encrypt,
  decrypt,
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken
};
