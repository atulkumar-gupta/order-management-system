const SchedulerLog = require('../models/SchedulerLog');
const schedulerService = require('../services/schedulerService');

exports.triggerScheduler = async (req, res) => {
  try {
    const result = await schedulerService.processOrders();
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Scheduler error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getSchedulerLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [logs, total] = await Promise.all([
      SchedulerLog.find()
        .sort({ executionTime: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      SchedulerLog.countDocuments()
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get scheduler logs error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getSchedulerStats = async (req, res) => {
  try {
    const stats = await SchedulerLog.aggregate([
      {
        $group: {
          _id: null,
          totalExecutions: { $sum: 1 },
          totalOrdersProcessed: { $sum: '$ordersProcessed' },
          totalStatusChanges: { $sum: '$statusChanges' },
          avgDuration: { $avg: '$duration' },
          successCount: {
            $sum: { $cond: [{ $eq: ['$status', 'SUCCESS'] }, 1, 0] }
          },
          failedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalExecutions: 0,
        totalOrdersProcessed: 0,
        totalStatusChanges: 0,
        avgDuration: 0,
        successCount: 0,
        failedCount: 0
      }
    });
  } catch (error) {
    console.error('Get scheduler stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};