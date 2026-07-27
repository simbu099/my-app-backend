import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';

dotenv.config();
connectDB();

const app = express();

// ✅ CORS Config Fix: All origins / Vercel Domain-க்கு Permission கொடுப்பது
app.use(
  cors({
    origin: '*', // அல்லது specific domain: 'https://my-app-frontend-xi.vercel.app'
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Inventory Backend Running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Enterprise Server running on port ${PORT}`));