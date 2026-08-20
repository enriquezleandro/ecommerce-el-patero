const prisma = require('../config/db');

async function create(req, res) {
  const { id: productId } = req.params;
  const { rating, comment } = req.body;

  const [product, user] = await Promise.all([
    prisma.product.findUnique({ where: { id: productId } }),
    prisma.user.findUnique({ where: { id: req.userId } }),
  ]);

  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

  const review = await prisma.review.create({
    data: { productId, userId: user.id, userName: user.name, rating, comment },
  });

  // El rating del producto es el promedio de sus reviews, no un valor fijo:
  // se recalcula cada vez que se agrega una reseña nueva.
  const agg = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: { rating: agg._avg.rating ?? undefined },
  });

  res.status(201).json(review);
}

module.exports = { create };
