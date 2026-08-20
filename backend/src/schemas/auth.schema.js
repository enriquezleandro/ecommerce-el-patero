const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('email inválido'),
  password: z.string().min(6, 'password debe tener al menos 6 caracteres'),
  name: z.string().trim().min(1, 'name es requerido'),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('email inválido'),
  password: z.string().min(1, 'password es requerido'),
});

const addressSchema = z.object({
  street: z.string().trim().min(1),
  city: z.string().trim().min(1),
  province: z.string().trim().min(1),
  postalCode: z.string().trim().min(1),
  phone: z.string().trim().min(1),
});

const savedPaymentMethodSchema = z.object({
  type: z.enum(['credit', 'debit']),
  lastFour: z.string().trim().length(4),
});

const updateProfileSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  address: addressSchema.optional(),
  savedPaymentMethod: savedPaymentMethodSchema.optional(),
});

module.exports = { registerSchema, loginSchema, updateProfileSchema };
