// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  orderId: { type: String, required: true },
  products: [
    {
      id: { type: String, required: true },
      quantity: { type: String, required: true },
      price: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
  paymentStatus: { type: String, required: true },
  total: { type: String, required: true },
  status: { type: String, required: true },
  shipping: { type: String, required: true },
  box: { type: Boolean, required: true },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
