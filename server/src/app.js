import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import authRoutes from './routes/authRoutes.js';
import sitemapRoutes from './routes/sitemapRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

// Process-level safety guards to ensure server never terminates on external network timeouts
process.on('unhandledRejection', (reason) => {
  console.warn('⚠️ Process unhandled rejection:', reason?.message || reason);
});
process.on('uncaughtException', (err) => {
  console.warn('⚠️ Process uncaught exception:', err?.message || err);
});

const app = express();
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false
  })
);
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Connect MongoDB (seamlessly falls back to JSON catalog if MONGO_URI is not yet configured)
connectDB();

// API & SEO Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/', sitemapRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'CLASSICAL DECOR I D (DST Deco)',
    email: 'dstdeco@gmail.com',
    whatsapp: '+971 543 532 585'
  });
});

// Serve static product assets directly from client/public/assets
const publicAssetsPath = path.join(__dirname, '../../client/public/assets');
if (fs.existsSync(publicAssetsPath)) {
  app.use('/assets', express.static(publicAssetsPath));
}

// Serve frontend production build (client/dist) if built
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Classical Decor ID (DST Deco) Server running on http://localhost:${PORT}`);
  });
}

export default app;
