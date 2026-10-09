/**
 * Utilidad para calcular el rango de paginación compatible con Supabase (.range(from, to))
 * @param {number} page - Número de página actual (empezando en 1)
 * @param {number} limit - Cantidad de registros por página
 * @returns {Object} { from, to }
 */
const getPagination = (page = 1, limit = 10) => {
  const p = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
  const l = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;

  const from = (p - 1) * l;
  const to = from + l - 1;

  return { from, to, page: p, limit: l };
};

module.exports = {
  getPagination
};
