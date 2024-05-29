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
  address: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    pin: { type: String, required: true },
    state: { type: String, required: true },
    default: { type: Boolean }
},
  paymentStatus: { type: String, required: true },
  total: { type: String, required: true },
  status: { type: String, required: true },
  shipping: { type: String, required: true },
  box: { type: Boolean, required: true },
  paymentLink: {type: String},
  tracking: {type: String},
  updated: {type: Date, default: Date.now}
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
