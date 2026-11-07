import express from 'express';
import { handleContactSubmit, getContactMessages } from '../controllers/contactController.js';
import { recordVisitorStats } from '../controllers/statsController.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'portfolio-backend',
    timestamp: new Date().toISOString()
  });
});

// Contact endpoints
router.post('/contact', handleContactSubmit);
router.get('/contact', getContactMessages);

// Screen ratio / visitor telemetry
router.post('/stats', recordVisitorStats);

export default router;
