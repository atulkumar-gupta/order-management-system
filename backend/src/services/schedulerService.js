const Order = require('../models/Order');
const StatusHistory = require('../models/StatusHistory');
const SchedulerLog = require('../models/SchedulerLog');
const mongoose = require('mongoose');

// const STATUS_FLOW = {
//   PLACED: {
//     nextStatus: 'PROCESSING',
//     timeThreshold: 10 * 60 * 1000
//   },
//   PROCESSING: {
//     nextStatus: 'READY_TO_SHIP',
//     timeThreshold: 20 * 60 * 1000
//   }
// };
const STATUS_FLOW = {
  PLACED: {
    nextStatus: "PROCESSING",
    timeThreshold:
      Number(process.env.PLACED_TO_PROCESSING_MINUTES || 10) * 60 * 1000,
  },

  PROCESSING: {
    nextStatus: "READY_TO_SHIP",
    timeThreshold:
      Number(process.env.PROCESSING_TO_READY_MINUTES || 20) * 60 * 1000,
  },
};
exports.processOrders = async () => {
  const startTime = Date.now();
  let ordersProcessed = 0;
  let statusChanges = 0;
  let processedOrders = [];
  let errors = [];

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const orders = await Order.find({
        orderStatus: { $in: ['PLACED', 'PROCESSING'] }
      }).session(session);

      console.log(`🔄 Processing ${orders.length} orders...`);

      for (const order of orders) {
        try {
          const statusFlow = STATUS_FLOW[order.orderStatus];
          
          if (!statusFlow) continue;

          const timeElapsed = Date.now() - order.statusUpdatedAt.getTime();
          
          if (timeElapsed >= statusFlow.timeThreshold) {
            const previousStatus = order.orderStatus;
            const newStatus = statusFlow.nextStatus;

            order.orderStatus = newStatus;
            order.statusUpdatedAt = new Date();
            await order.save({ session });

            const statusHistory = new StatusHistory({
              orderId: order._id,
              previousStatus,
              newStatus,
              reason: `Auto-updated after ${statusFlow.timeThreshold / 60000} minutes`,
              triggeredBy: 'SYSTEM',
              metadata: {
                timeElapsed: timeElapsed,
                threshold: statusFlow.timeThreshold
              }
            });
            await statusHistory.save({ session });

            order.statusHistory.push(statusHistory._id);
            await order.save({ session });

            statusChanges++;
            processedOrders.push({
              orderId: order.orderId,
              previousStatus,
              newStatus
            });
          }
        } catch (error) {
          errors.push({
            orderId: order.orderId,
            error: error.message
          });
          console.error(`Error processing order ${order.orderId}:`, error);
        }
      }

      await session.commitTransaction();
      ordersProcessed = orders.length;

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    const duration = Date.now() - startTime;
    const log = await SchedulerLog.create({
      executionTime: new Date(),
      ordersProcessed,
      statusChanges,
      duration,
      status: errors.length > 0 ? 'PARTIAL' : 'SUCCESS',
      error: errors.length > 0 ? `${errors.length} orders failed` : null,
      details: JSON.stringify({
        processedOrders,
        errors,
        summary: {
          totalOrders: ordersProcessed,
          successfulChanges: statusChanges,
          failedOrders: errors.length
        }
      })
    });

    return {
      success: true,
      logId: log._id,
      ordersProcessed,
      statusChanges,
      duration,
      processedOrders,
      errors
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    
    await SchedulerLog.create({
      executionTime: new Date(),
      ordersProcessed,
      statusChanges,
      duration,
      status: 'FAILED',
      error: error.message,
      details: JSON.stringify({
        processedOrders,
        errors: [...errors, { error: error.message }]
      })
    });

    throw error;
  }
};