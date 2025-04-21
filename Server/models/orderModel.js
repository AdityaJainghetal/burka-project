const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderItems: [
    {
      productName: String,
      price: Number,
      quantity: Number,
      productImage: String,
      priceAfterDiscount: Number,
    },
  ],
  totalPrice: Number,
  totalPriceAfterDiscount: Number,
  dueAmount: Number,
  discountName: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'partially_paid', 'paid'],
    default: 'pending',
  },
  payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);