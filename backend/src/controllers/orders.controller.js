const prisma = require('../config/db');

// Igual que con Product: la dirección plana de la DB se re-anida en
// `shippingAddress` y el Decimal de Prisma se convierte a number.
function serialize(order) {
  return {
    id: order.id,
    userId: order.userId,
    items: order.items,
    total: Number(order.total),
    status: order.status,
    shippingAddress: {
      street: order.shippingStreet,
      city: order.shippingCity,
      province: order.shippingProvince,
      postalCode: order.shippingPostalCode,
      phone: order.shippingPhone,
    },
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
  };
}

async function create(req, res) {
  const { items, total, shippingAddress, paymentMethod } = req.body;

  const order = await prisma.order.create({
    data: {
      userId: req.userId,
      items,
      total,
      shippingStreet: shippingAddress.street,
      shippingCity: shippingAddress.city,
      shippingProvince: shippingAddress.province,
      shippingPostalCode: shippingAddress.postalCode,
      shippingPhone: shippingAddress.phone,
      paymentMethod,
    },
  });

  res.status(201).json(serialize(order));
}

async function list(req, res) {
  const orders = await prisma.order.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });

  res.json(orders.map(serialize));
}

module.exports = { create, list };
