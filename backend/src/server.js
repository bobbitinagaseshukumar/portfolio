import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables reliably from backend/.env or cwd
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import apiRoutes from './routes/api.js';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import { testDbConnection } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Legacy/contact routes
app.use('/api', apiRoutes);

// Public synchronized portfolio & document delivery endpoints (with permission enforcement)
app.use('/api/public', publicRoutes);

// Dedicated Admin Portal API routes
app.use('/api/admin', adminRoutes);

// Root health check
app.get('/', (req, res) => {
  res.json({
    message: '🚀 3D Portfolio & Document Management Engine is live on Render!',
    publicPortfolio: '/api/public/portfolio',
    adminLogin: '/api/admin/auth/login'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(err.status || 400).json({
    success: false,
    message: err.message || 'An unexpected error occurred'
  });
});

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  await testDbConnection();
});
