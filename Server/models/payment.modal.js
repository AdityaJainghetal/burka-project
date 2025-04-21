const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMode: {
    type: String,
    enum: ['Online Transfer', 'Cash', 'Cheque'],
    required: true,
  },
  receivingDate: {
    type: Date,
    default: Date.now,
  },
  remark: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Completed',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);