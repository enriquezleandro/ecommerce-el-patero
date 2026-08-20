const { Router } = require('express');
const controller = require('../controllers/payments.controller');

const router = Router();

// Se mantiene en la raíz (no bajo /api) para no romper la ruta que ya
// consumía el frontend original: POST /create-preference.
router.post('/create-preference', controller.createPreference);

module.exports = router;
