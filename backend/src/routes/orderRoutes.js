const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { orderRateLimiter } = require('../middleware/authMiddleware');

router.post('/', orderRateLimiter, orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', orderRateLimiter, orderController.updateOrderStatus);
router.delete('/:id', orderRateLimiter, orderController.deleteOrder);

module.exports = router;