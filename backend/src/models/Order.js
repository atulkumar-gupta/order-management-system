const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    default: () => `ORD-${uuidv4().slice(0, 8).toUpperCase()}`,
    unique: true,
    required: true,
    index: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Customer name cannot exceed 100 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9+\-\s()]{10,15}$/, 'Please enter a valid phone number']
  },
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive'],
    max: [999999.99, 'Amount cannot exceed 999,999.99']
  },
  paymentStatus: {
    type: String,
    enum: ['PAID', 'PENDING', 'FAILED'],
    default: 'PENDING'
  },
  orderStatus: {
    type: String,
    enum: ['PLACED', 'PROCESSING', 'READY_TO_SHIP', 'COMPLETED', 'CANCELLED'],
    default: 'PLACED',
    index: true
  },
  statusHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StatusHistory'
  }],
  statusUpdatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ customerName: 'text', orderId: 'text' });

module.exports = mongoose.model('Order', orderSchema);