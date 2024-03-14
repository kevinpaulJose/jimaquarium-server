// models/Address.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  address: [
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        pin: { type: String, required: true },
        state: { type: String, required: true },
        default: { type: Boolean }
    }
  ]
 
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
