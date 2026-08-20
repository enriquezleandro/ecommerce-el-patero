// Middleware genérico: valida req.body contra un schema de zod y, si pasa,
// reemplaza req.body por el resultado parseado (con defaults ya aplicados).
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: result.error.issues.map((issue) => ({
          campo: issue.path.join('.'),
          mensaje: issue.message,
        })),
      });
    }

    req.body = result.data;
    next();
  };
}

module.exports = { validate };
