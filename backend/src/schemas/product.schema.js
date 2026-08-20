const { z } = require('zod');

const CATEGORIES = ['indoor', 'parafernalia', 'fertilizantes', 'macetas', 'indumentaria'];

const productCreateSchema = z.object({
  name: z.string().trim().min(1, 'name es requerido'),
  category: z.enum(CATEGORIES),
  price: z.number().positive('price debe ser mayor a 0'),
  originalPrice: z.number().positive().optional(),
  description: z.string().trim().min(1, 'description es requerida'),
  specifications: z.record(z.string(), z.string()).optional(),
  images: z.array(z.string().url('cada imagen debe ser una URL válida')).min(1, 'images requiere al menos 1 imagen'),
  stock: z.number().int().min(0).default(0),
  isNew: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  rating: z.number().min(0).max(5).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
});

const productUpdateSchema = productCreateSchema.partial();

module.exports = { productCreateSchema, productUpdateSchema, CATEGORIES };
