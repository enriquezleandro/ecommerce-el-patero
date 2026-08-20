const { Prisma } = require('@prisma/client');

// Middleware de error final. Express 5 reenvía automáticamente las excepciones
// lanzadas dentro de handlers async, así que los controllers no necesitan
// try/catch propio: alcanza con `await` y dejar que el error llegue hasta acá.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: `Ya existe un registro con ese ${err.meta?.target ?? 'valor único'}` });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Recurso no encontrado' });
    }
  }

  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
}

module.exports = { errorHandler };
