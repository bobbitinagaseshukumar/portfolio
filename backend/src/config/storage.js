import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { supabase } from './supabase.js';

// Ensure local upload directory exists
const uploadDir = path.resolve(process.cwd(), 'backend', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage Configuration (secure sanitized unique filenames)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueId = crypto.randomUUID();
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${uniqueId}_${safeBase}${ext}`);
  }
});

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'video/mp4',
  'video/webm',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.pdf', '.mp4', '.webm', '.doc', '.docx'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_MIME_TYPES.includes(file.mimetype) || ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype || 'unknown'} (${ext}). Allowed: Images, PDFs, and MP4/WebM videos.`));
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max limit
  }
});

/**
 * Uploads a file to Supabase Storage if configured, or keeps local storage reference
 */
export const storeFile = async (file, visibility = 'PUBLIC') => {
  const bucketName = visibility === 'PUBLIC' ? 'portfolio-public' : 'portfolio-private';
  const fileName = path.basename(file.path);

  // If Supabase is configured with keys
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const fileBuffer = fs.readFileSync(file.path);
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileBuffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (!error && data) {
        return {
          storagePath: data.path,
          bucket: bucketName,
          provider: 'supabase'
        };
      }
    } catch (err) {
      console.warn('Supabase storage upload fallback to local storage:', err.message);
    }
  }

  // Local storage fallback (fully functional for production or offline)
  return {
    storagePath: fileName,
    bucket: 'local',
    provider: 'local'
  };
};

export const getFilePath = (storagePath) => {
  return path.join(uploadDir, storagePath);
};
