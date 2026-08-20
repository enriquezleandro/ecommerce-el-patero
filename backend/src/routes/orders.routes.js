const { Router } = require('express');
const controller = require('../controllers/orders.controller');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { createOrderSchema } = require('../schemas/order.schema');

const router = Router();

router.use(requireAuth);
router.post('/', validate(createOrderSchema), controller.create);
router.get('/', controller.list);

module.exports = router;
