const { Router } = require('express');
const controller = require('../controllers/payments.controller');

const router = Router();

// Se mantiene en la raíz (no bajo /api) para no romper la ruta que ya
// consumía el frontend original: POST /create-preference.
router.post('/create-preference', controller.createPreference);

// Mercado Pago le pega a esto directo (no pasa por el frontend). La URL
// completa se configura en el panel de MP y también se manda por
// notification_url al crear cada preferencia.
router.post('/webhooks/mercadopago', controller.handleWebhook);

module.exports = router;
