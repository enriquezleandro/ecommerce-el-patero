const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { signToken } = require('../utils/jwt');

// El User de la DB guarda la dirección y el medio de pago en columnas planas
// (street, city, ...); acá se re-anidan en `address` / `savedPaymentMethod`
// tal como los espera el tipo User de src/lib/types.ts. Nunca se devuelve
// passwordHash.
function serialize(user) {
  const hasAddress = user.street || user.city || user.province || user.postalCode || user.phone;
  const hasPayment = user.paymentType && user.paymentLastFour;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: hasAddress
      ? {
          street: user.street ?? '',
          city: user.city ?? '',
          province: user.province ?? '',
          postalCode: user.postalCode ?? '',
          phone: user.phone ?? '',
        }
      : undefined,
    savedPaymentMethod: hasPayment
      ? { type: user.paymentType, lastFour: user.paymentLastFour }
      : undefined,
  };
}

async function register(req, res) {
  const { email, password, name } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, name } });

  res.status(201).json({ token: signToken(user.id), user: serialize(user) });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  const passwordOk = user && (await bcrypt.compare(password, user.passwordHash));

  if (!passwordOk) {
    return res.status(401).json({ error: 'Email o contraseña incorrectos' });
  }

  res.json({ token: signToken(user.id), user: serialize(user) });
}

async function me(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(serialize(user));
}

async function updateMe(req, res) {
  const { name, email, address, savedPaymentMethod } = req.body;

  const user = await prisma.user.update({
    where: { id: req.userId },
    data: {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(address !== undefined && {
        street: address.street,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        phone: address.phone,
      }),
      ...(savedPaymentMethod !== undefined && {
        paymentType: savedPaymentMethod.type,
        paymentLastFour: savedPaymentMethod.lastFour,
      }),
    },
  });

  res.json(serialize(user));
}

module.exports = { register, login, me, updateMe };
