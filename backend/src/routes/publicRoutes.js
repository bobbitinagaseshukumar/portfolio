import express from 'express';
import {
  getPublicPortfolio,
  getPublicDocuments,
  previewPublicDocument,
  downloadPublicDocument
} from '../controllers/publicContentController.js';

const router = express.Router();

// Synchronized public portfolio data
router.get('/portfolio', getPublicPortfolio);

// Document & Credential showcase (strictly public & approved only)
router.get('/documents', getPublicDocuments);
router.get('/documents/:id/preview', previewPublicDocument);
router.get('/documents/:id/download', downloadPublicDocument);

export default router;
