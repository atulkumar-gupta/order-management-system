const mongoose = require('mongoose');

const schedulerLogSchema = new mongoose.Schema({
  executionTime: {
    type: Date,
    default: Date.now,
    index: true
  },
  ordersProcessed: {
    type: Number,
    default: 0
  },
  statusChanges: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED', 'PARTIAL'],
    default: 'SUCCESS'
  },
  error: {
    type: String,
    default: null
  },
  details: {
    type: String,
    default: null
  },
  summary: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

schedulerLogSchema.index({ executionTime: -1 });

module.exports = mongoose.model('SchedulerLog', schedulerLogSchema);