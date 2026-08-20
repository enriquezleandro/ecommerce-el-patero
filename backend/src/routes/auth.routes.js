const { Router } = require('express');
const controller = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { registerSchema, loginSchema, updateProfileSchema } = require('../schemas/auth.schema');

const router = Router();

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.get('/me', requireAuth, controller.me);
router.put('/me', requireAuth, validate(updateProfileSchema), controller.updateMe);

module.exports = router;
