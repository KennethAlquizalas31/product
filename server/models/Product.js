// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  product_code: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  date_added: { type: Date, required: true },
  isDeleted: { type: Boolean, default: false } // Add this field
});

export default mongoose.model('Product', productSchema);
