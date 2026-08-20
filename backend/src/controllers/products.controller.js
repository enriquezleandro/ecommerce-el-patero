const prisma = require('../config/db');

// Prisma serializa Decimal como string en JSON.stringify (vía su toJSON).
// Lo convertimos a number acá para que el frontend siempre reciba un número,
// tal como espera el tipo Product de src/lib/types.ts.
function serialize(product) {
  return {
    ...product,
    price: Number(product.price),
    originalPrice: product.originalPrice != null ? Number(product.originalPrice) : undefined,
  };
}

async function list(req, res) {
  const { category, q } = req.query;

  const where = {
    ...(category ? { category } : {}),
    ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
  };

  const products = await prisma.product.findMany({
    where,
    include: { reviews: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json(products.map(serialize));
}

async function getById(req, res) {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { reviews: true },
  });

  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(serialize(product));
}

async function create(req, res) {
  const product = await prisma.product.create({
    data: req.body,
    include: { reviews: true },
  });

  res.status(201).json(serialize(product));
}

async function update(req, res) {
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: req.body,
    include: { reviews: true },
  });

  res.json(serialize(product));
}

async function remove(req, res) {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.status(204).send();
}

module.exports = { list, getById, create, update, remove };
