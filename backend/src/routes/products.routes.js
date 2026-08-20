const { Router } = require('express');
const controller = require('../controllers/products.controller');
const { validate } = require('../middleware/validate');
const { productCreateSchema, productUpdateSchema } = require('../schemas/product.schema');

const router = Router();

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', validate(productCreateSchema), controller.create);
router.put('/:id', validate(productUpdateSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
