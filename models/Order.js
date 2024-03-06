// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  id: { type: String, required: true },
  products: [
    {
      id: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      name: { type: String, required: true },
    },
  ],
  paymentStatus: { type: String, required: true },
  total: { type: Number, required: true },
  status: { type: String, required: true },
  shipping: { type: Number, required: true },
  box: { type: Boolean, required: true },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
