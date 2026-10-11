const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Configuración de cifrado AES-256-GCM
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_ROUNDS = 12;

// Se obtiene la clave maestra del entorno o se deriva de un secreto seguro
const getMasterKey = () => {
  const secret = process.env.ENCRYPTION_SECRET || process.env.SUPABASE_KEY || 'default-secure-fallback-driving-school-key-32b!';
  return crypto.createHash('sha256').update(String(secret)).digest();
};

/**
 * Encripta un texto sensible (DNI, teléfonos, datos personales) usando AES-256-GCM
 * @param {string} text - Texto en plano
 * @returns {string} - Cadena cifrada con formato iv:authTag:encrypted
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
    console.error('[SECURITY ERROR] Fallo al encriptar dato sensible:', err.message);
    throw new Error('Error al proteger datos sensibles');
  }
};

/**
 * Desencripta un texto previamente cifrado con AES-256-GCM
 * @param {string} encryptedString - iv:authTag:encrypted
 * @returns {string} - Texto original
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
    console.error('[SECURITY ERROR] Fallo al desencriptar o manipulación detectada:', err.message);
    throw new Error('Integridad de datos violada o llave inválida');
  }
};

/**
 * Hashea contraseñas usando bcrypt con salt rounds reforzado
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} - Hash seguro no reversible
 */
const hashPassword = async (password) => {
  if (!password) throw new Error('Contraseña requerida');
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compara contraseña contra su hash de forma segura resistente a timing attacks
 * @param {string} password - Contraseña ingresada
 * @param {string} hash - Hash guardado
 * @returns {Promise<boolean>}
 */
const verifyPassword = async (password, hash) => {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
};

module.exports = {
  encrypt,
  decrypt,
  hashPassword,
  verifyPassword
};
