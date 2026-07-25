import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
    threshold: { type: Number, required: true, default: 10 }, // Low stock threshold
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);