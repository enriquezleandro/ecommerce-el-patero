const { MercadoPagoConfig, Preference } = require('mercadopago');
const env = require('../config/env');

const client = new MercadoPagoConfig({ accessToken: env.mpAccessToken });

async function createPreference(req, res) {
  const { items, shippingCost } = req.body;

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
      payer: {
        name: 'Test User Patero',
        email: 'test_user_2665253413@testuser.com',
      },
      // Esta UI no usa react-router (navega por estado de React), así que no
      // hay rutas /checkout/success reales — todo vuelve a la raíz con un
      // query param propio que App.tsx lee al montar.
      back_urls: {
        success: `${env.frontendUrl}/?checkout=success`,
        failure: `${env.frontendUrl}/?checkout=failure`,
        pending: `${env.frontendUrl}/?checkout=pending`,
      },
      // auto_return se mantiene desactivado: con back_urls en localhost, Mercado
      // Pago devuelve error 400 al intentar auto-redirigir. Se puede habilitar
      // ('approved') una vez que FRONTEND_URL sea un dominio público.
    },
  });

  res.json({
    id: response.id,
    init_point: response.init_point,
    sandbox_init_point: response.sandbox_init_point,
  });
}

module.exports = { createPreference };
