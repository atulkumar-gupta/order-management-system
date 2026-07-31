const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true
  },
  previousStatus: {
    type: String,
    required: true
  },
  newStatus: {
    type: String,
    required: true
  },
  changedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  reason: {
    type: String,
    default: 'Status updated by system'
  },
  triggeredBy: {
    type: String,
    enum: ['SYSTEM', 'USER'],
    default: 'SYSTEM'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

statusHistorySchema.index({ orderId: 1, changedAt: -1 });

module.exports = mongoose.model('StatusHistory', statusHistorySchema);