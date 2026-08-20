const { verifyToken } = require('../utils/jwt');

// Exige `Authorization: Bearer <token>`. Si es válido, deja el id del usuario
// en req.userId para que el controller lo use; si no, corta con 401 antes de
// llegar al controller.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    req.userId = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
}

module.exports = { requireAuth };
