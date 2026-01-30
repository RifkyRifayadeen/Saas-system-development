const router = require('express').Router();
const subscriptionController = require('../controllers/subscriptionController');
const authorization = require('../middleware/authMiddleware');

router.get('/plans', subscriptionController.getPlans);

router.use(authorization);
router.post('/subscribe', subscriptionController.subscribe);
router.get('/status', subscriptionController.getStatus);

module.exports = router;
