const { Router } = require('express');
const controller = require('../controllers/products.controller');
const reviewsController = require('../controllers/reviews.controller');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { productCreateSchema, productUpdateSchema } = require('../schemas/product.schema');
const { createReviewSchema } = require('../schemas/review.schema');

const router = Router();

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', validate(productCreateSchema), controller.create);
router.put('/:id', validate(productUpdateSchema), controller.update);
router.delete('/:id', controller.remove);
router.post('/:id/reviews', requireAuth, validate(createReviewSchema), reviewsController.create);

module.exports = router;
