import express from 'express';
import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Stock IN / Stock OUT Action
router.post('/stock-op', protect, async (req, res) => {
  const { productId, type, quantity, notes } = req.body; // type: 'IN' or 'OUT'
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (type === 'OUT' && product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    // Update product quantity
    product.quantity = type === 'IN' ? product.quantity + Number(quantity) : product.quantity - Number(quantity);
    await product.save();

    // Log transaction
    const transaction = await Transaction.create({
      product: productId,
      type,
      quantity,
      performedBy: req.user._id,
      notes,
    });

    res.json({ message: 'Stock updated successfully', product, transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Dashboard Analytics API
router.get('/dashboard-metrics', protect, async (req, res) => {
  try {
    const products = await Product.find();
    const totalProducts = products.length;
    
    let totalValue = 0;
    let lowStockItems = [];

    products.forEach((p) => {
      totalValue += p.price * p.quantity;
      if (p.quantity <= p.threshold) {
        lowStockItems.push(p);
      }
    });

    res.json({
      totalProducts,
      totalValue,
      lowStockCount: lowStockItems.length,
      lowStockItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;