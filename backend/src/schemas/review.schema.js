const { z } = require('zod');

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1, 'comment es requerido'),
});

module.exports = { createReviewSchema };
