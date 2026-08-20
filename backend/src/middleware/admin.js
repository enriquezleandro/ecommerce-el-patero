const prisma = require('../config/db');

// Se usa siempre después de requireAuth (necesita req.userId ya seteado).
// No confía en el JWT para el rol: lo revalida contra la DB en cada request,
// así que si se le revoca isAdmin a alguien, el cambio pega al toque, sin
// esperar a que expire ningún token viejo dando vueltas.
async function requireAdmin(req, res, next) {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });

  if (!user?.isAdmin) {
    return res.status(403).json({ error: 'No tenés permisos de administrador' });
  }

  next();
}

module.exports = { requireAdmin };
