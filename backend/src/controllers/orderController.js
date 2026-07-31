const Order = require('../models/Order');
const StatusHistory = require('../models/StatusHistory');

exports.createOrder = async (req, res) => {
  try {
    const { customerName, phoneNumber, productName, amount, paymentStatus } = req.body;

    if (!customerName || !phoneNumber || !productName || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const order = await Order.create({
      customerName,
      phoneNumber,
      productName,
      amount,
      paymentStatus: paymentStatus || 'PENDING'
    });

    const statusHistory = await StatusHistory.create({
      orderId: order._id,
      previousStatus: 'PLACED',
      newStatus: 'PLACED',
      reason: 'Order created',
      triggeredBy: 'USER'
    });

    order.statusHistory.push(statusHistory._id);
    await order.save();

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    
    const query = {};
    if (status && status !== 'ALL') {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('statusHistory')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id })
      .populate('statusHistory');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const order = await Order.findOne({ orderId: id });
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = status;
    order.statusUpdatedAt = Date.now();
    await order.save();

    const statusHistory = await StatusHistory.create({
      orderId: order._id,
      previousStatus,
      newStatus: status,
      reason: 'Status updated by user',
      triggeredBy: 'USER'
    });

    order.statusHistory.push(statusHistory._id);
    await order.save();

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    await StatusHistory.deleteMany({ orderId: order._id });
    await order.deleteOne();

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};