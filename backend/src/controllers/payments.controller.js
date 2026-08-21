const crypto = require('crypto');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const env = require('../config/env');
const prisma = require('../config/db');

const client = new MercadoPagoConfig({ accessToken: env.mpAccessToken });

// Mapeo de estados de pago de Mercado Pago a nuestro OrderStatus. MP tiene
// más granularidad (in_process, authorized, etc.) que colapsamos en
// "pending" hasta que haya una resolución definitiva.
const MP_STATUS_TO_ORDER_STATUS = {
  approved: 'processing',
  rejected: 'cancelled',
  cancelled: 'cancelled',
  refunded: 'cancelled',
  charged_back: 'cancelled',
};

async function createPreference(req, res) {
  const { items, shippingCost, orderId } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items es requerido y debe ser un array no vacío' });
  }

  const itemsParaMercadoPago = items.map((item) => ({
    id: item.id,
    title: item.title,
    quantity: Number(item.quantity),
    unit_price: Number(item.unit_price),
    currency_id: 'ARS',
  }));

  if (shippingCost && shippingCost > 0) {
    itemsParaMercadoPago.push({
      id: 'shipping',
      title: 'Costo de Envío',
      quantity: 1,
      unit_price: Number(shippingCost),
      currency_id: 'ARS',
    });
  }

  const preference = new Preference(client);

  const response = await preference.create({
    body: {
      items: itemsParaMercadoPago,
      // external_reference es cómo el webhook sabe a qué Order de nuestra
      // DB corresponde el pago cuando MP nos avisa. orderId es opcional acá
      // (endpoint público) pero createPreference SIEMPRE se llama con uno
      // desde CheckoutPage, que crea el pedido antes de ir a pagar.
      ...(orderId && { external_reference: orderId }),
      notification_url: `${env.backendUrl}/webhooks/mercadopago`,
      // Esta UI no usa react-router (navega por estado de React), así que no
      // hay rutas /checkout/success reales — todo vuelve a la raíz con un
      // query param propio que App.tsx lee al montar.
      back_urls: {
        success: `${env.frontendUrl}/?checkout=success`,
        failure: `${env.frontendUrl}/?checkout=failure`,
        pending: `${env.frontendUrl}/?checkout=pending`,
      },
      // Ahora que FRONTEND_URL es un dominio público (antes era localhost,
      // donde MP devuelve 400 al intentar auto-redirigir), se puede activar
      // el regreso automático tras un pago aprobado.
      auto_return: 'approved',
    },
  });

  res.json({
    id: response.id,
    init_point: response.init_point,
    sandbox_init_point: response.sandbox_init_point,
  });
}

// Valida la firma que Mercado Pago manda en el header x-signature, según el
// esquema oficial: HMAC-SHA256 de un "manifest" armado con el id del recurso,
// el x-request-id y el timestamp, usando el secreto configurado en el panel
// de MP (Tus integraciones > la app > Webhooks). Sin esto, cualquiera podría
// pegarle a este endpoint simulando un pago aprobado.
function isValidSignature(req) {
  const signatureHeader = req.headers['x-signature'];
  const requestId = req.headers['x-request-id'];
  const dataId = req.query['data.id'] || req.query.id;

  if (!signatureHeader || !requestId || !dataId) return false;

  const parts = Object.fromEntries(
    String(signatureHeader)
      .split(',')
      .map((pair) => pair.split('=').map((s) => s.trim()))
  );
  const { ts, v1: receivedHash } = parts;
  if (!ts || !receivedHash) return false;

  const manifest = `id:${String(dataId).toLowerCase()};request-id:${requestId};ts:${ts};`;
  const expectedHash = crypto.createHmac('sha256', env.mpWebhookSecret).update(manifest).digest('hex');

  const expectedBuf = Buffer.from(expectedHash, 'utf8');
  const receivedBuf = Buffer.from(receivedHash, 'utf8');
  return expectedBuf.length === receivedBuf.length && crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

async function handleWebhook(req, res) {
  if (!isValidSignature(req)) {
    return res.status(401).json({ error: 'Firma inválida' });
  }

  // MP notifica varios "topics" (payment, merchant_order, ...); solo nos
  // interesan los pagos. Formato clásico: topic/id. Formato nuevo: type/data.id.
  const type = req.query.type || req.query.topic;
  const paymentId = req.query['data.id'] || req.query.id;

  if (type !== 'payment' || !paymentId) {
    return res.status(200).send();
  }

  const payment = new Payment(client);
  const paymentInfo = await payment.get({ id: paymentId });

  const orderId = paymentInfo.external_reference;
  const newStatus = MP_STATUS_TO_ORDER_STATUS[paymentInfo.status];

  if (orderId && newStatus) {
    // updateMany en vez de update: si external_reference viene adulterado o
    // de un pedido que ya no existe, no queremos que esto tire un error 500
    // y que MP reintente en loop — simplemente no actualiza nada.
    await prisma.order.updateMany({
      where: { id: orderId },
      data: { status: newStatus, mpPaymentId: String(paymentInfo.id) },
    });
  }

  res.status(200).send();
}

module.exports = { createPreference, handleWebhook };
