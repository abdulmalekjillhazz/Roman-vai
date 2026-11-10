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
import heroSlideRoutes from './routes/heroSlideRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import businessProfileRoutes from './routes/businessProfileRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
app.disable('x-powered-by');
// Only trust proxy hops explicitly configured by the deployment operator.
if (/^\d+$/.test(process.env.TRUST_PROXY_HOPS || '')) {
  app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS));
}
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false
  })
);

// Restricted CORS whitelist for production security
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.NEXT_PUBLIC_SITE_URL,
  'https://classicaldecorid.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(Object.assign(new Error('Blocked by CORS policy'), { status: 403 }));
      }
    },
    credentials: true
  })
);

app.use(express.json({ limit: '2mb' }));

// Connect MongoDB (seamlessly falls back to JSON catalog if MONGO_URI is not yet configured)
connectDB();

// API & SEO Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/hero-slides', heroSlideRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/business-profile', businessProfileRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'Classical Decor ID (classicaldecorid)',
    email: 'info@classicaldecorid.com',
    whatsapp: '+971 543 532 585'
  });
});

// Serve static product assets directly from client/public/assets
const publicAssetsPath = path.join(__dirname, '../../client/public/assets');
if (fs.existsSync(publicAssetsPath)) {
  app.use('/assets', express.static(publicAssetsPath));
}

// Root API status endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Classical Decor ID (DST Deco) API Backend',
    frontend: process.env.CLIENT_URL || 'http://localhost:3000',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      faqs: '/api/faqs',
      leads: '/api/leads',
      health: '/api/health'
    }
  });
});

app.use('/api', (req, res) => res.status(404).json({ message: 'API endpoint not found.' }));

// Centralized Express error handler (prevents leaking internal stack/paths in production)
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error('Express request error:', err.message);
  const statusCode = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'An unexpected error occurred.'
    : err.message || 'An unexpected error occurred.';
  res.status(statusCode).json({ message, ...(req.path.startsWith('/api/leads') ? { status: 'error' } : {}) });
});

const PORT = process.env.PORT || 5000;
const startedDirectly = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (startedDirectly && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Classical Decor ID (DST Deco) Server running on http://localhost:${PORT}`);
  });
}

export default app;
