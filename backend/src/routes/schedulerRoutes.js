const express = require('express');
const router = express.Router();
const schedulerController = require('../controllers/schedulerController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/run', authMiddleware, schedulerController.triggerScheduler);
router.get('/logs', authMiddleware, schedulerController.getSchedulerLogs);
router.get('/stats', authMiddleware, schedulerController.getSchedulerStats);

module.exports = router;