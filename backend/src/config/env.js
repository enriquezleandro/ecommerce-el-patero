require('dotenv').config();

const required = ['DATABASE_URL', 'MP_ACCESS_TOKEN', 'JWT_SECRET', 'MP_WEBHOOK_SECRET', 'BACKEND_URL'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Faltan variables de entorno requeridas: ${missing.join(', ')}. Revisá tu archivo .env (ver .env.example).`
  );
}

module.exports = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL,
  mpAccessToken: process.env.MP_ACCESS_TOKEN,
  // Firma secreta de la notificación webhook (panel de MP > Tus
  // integraciones > la app > Webhooks). Sin esto, cualquiera podría
  // mandarle a /webhooks/mercadopago un POST falso diciendo "pedido X
  // pagado" — se exige como requerida a propósito, igual que JWT_SECRET.
  mpWebhookSecret: process.env.MP_WEBHOOK_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  // URL pública de este mismo backend (sin barra final), para que Mercado
  // Pago sepa a dónde mandar la notificación del webhook. En local no hay
  // forma de que MP nos llegue igual (no hay URL pública), pero el env var
  // sigue siendo requerido para que el valor de producción nunca se olvide.
  backendUrl: (process.env.BACKEND_URL || '').replace(/\/$/, ''),
};
