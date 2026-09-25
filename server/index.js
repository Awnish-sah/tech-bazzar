import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import productsRoutes from './routes/productsRoutes.js';
import ordersRoutes from './routes/ordersRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import reviewsRoutes from './routes/reviewsRoutes.js';
import heroBannerRoutes from './routes/heroBannerRoutes.js';
import { checkConnection } from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = await checkConnection();
  res.json({
    status: 'ok',
    service: 'TechBazzar PostgreSQL Backend API',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users/addresses', addressRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/banners', heroBannerRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    name: 'TechBazzar API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      orders: '/api/orders',
      adminMetrics: '/api/admin/metrics'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🚀 TechBazzar Backend Server running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`======================================================`);

  const dbStatus = await checkConnection();
  if (dbStatus.connected) {
    console.log(`✅ Connected to PostgreSQL: "${dbStatus.database}" (${dbStatus.version})`);
    console.log(`⚡ Query latency: ${dbStatus.latencyMs}ms`);
  } else {
    console.log(`⚠️ PostgreSQL is not connected yet.`);
    console.log(`   Error: ${dbStatus.error}`);
    console.log(`   (The frontend will seamlessly use fallback local mode until PostgreSQL is started)`);
  }
  console.log(`======================================================\n`);
});

export default app;

