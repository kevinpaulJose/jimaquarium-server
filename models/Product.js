// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: false },
  theme: { type: String },
  size: { type: String },
  categories: { type: String },
  stock: { type: Number, required: true },
  img: { type: String, required: true }, // Store base64 image data
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
