const { z } = require('zod');

const createOrderSchema = z.object({
  items: z.array(z.record(z.string(), z.any())).min(1, 'items requiere al menos 1 producto'),
  total: z.number().positive('total debe ser mayor a 0'),
  shippingAddress: z.object({
    street: z.string().trim().min(1),
    city: z.string().trim().min(1),
    province: z.string().trim().min(1),
    postalCode: z.string().trim().min(1),
    phone: z.string().trim().min(1),
  }),
  paymentMethod: z.string().trim().min(1, 'paymentMethod es requerido'),
});

module.exports = { createOrderSchema };
