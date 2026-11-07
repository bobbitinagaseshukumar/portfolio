import express from 'express';
import {
  loginWithPassword,
  loginWithGoogle,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPasswordWithOtp,
  requestCredentialChangeOtp,
  updateCredentialsWithOtp,
  getAdminMe,
  logoutAdmin
} from '../controllers/adminAuthController.js';
import {
  getAdminDashboardStats,
  getAdminProfile,
  updateAdminProfile,
  getAdminEducation,
  addAdminEducation,
  updateAdminEducation,
  deleteAdminEducation,
  getAdminSkills,
  addAdminSkill,
  updateAdminSkill,
  deleteAdminSkill,
  getAdminProjects,
  addAdminProject,
  updateAdminProject,
  deleteAdminProject,
  getAdminCertifications,
  updateAdminCertifications,
  getAdminAchievements,
  updateAdminAchievements,
  getAdminSettings,
  updateAdminSettings,
  getAdminAuditLogs,
  publishWebsiteContent
} from '../controllers/adminContentController.js';
import {
  getAdminDocuments,
  uploadAdminDocument,
  updateAdminDocument,
  replaceAdminDocumentFile,
  restoreAdminDocumentVersion,
  deleteAdminDocument,
  getAdminDocumentVersions,
  streamAdminDocumentFile
} from '../controllers/adminDocumentController.js';
import { requireAdminAuth } from '../middleware/adminAuth.js';
import { uploadMiddleware } from '../config/storage.js';

const router = express.Router();

// --- AUTHENTICATION & RECOVERY ---
router.post('/auth/login', loginWithPassword);
router.post('/auth/google', loginWithGoogle);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/resend-otp', resendOtp);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPasswordWithOtp);
router.post('/auth/request-credential-change-otp', requireAdminAuth, requestCredentialChangeOtp);
router.put('/auth/update-credentials', requireAdminAuth, updateCredentialsWithOtp);
router.get('/auth/me', requireAdminAuth, getAdminMe);
router.post('/auth/logout', requireAdminAuth, logoutAdmin);

// --- DASHBOARD ---
router.get('/dashboard', requireAdminAuth, getAdminDashboardStats);

// --- COMPLETE DOCUMENT & FILE MANAGEMENT ---
router.get('/documents', requireAdminAuth, getAdminDocuments);
router.post('/documents/upload', requireAdminAuth, uploadMiddleware.single('file'), uploadAdminDocument);
router.put('/documents/:id', requireAdminAuth, updateAdminDocument);
router.post('/documents/:id/replace', requireAdminAuth, uploadMiddleware.single('file'), replaceAdminDocumentFile);
router.post('/documents/:id/restore/:versionId', requireAdminAuth, restoreAdminDocumentVersion);
router.get('/documents/:id/versions', requireAdminAuth, getAdminDocumentVersions);
router.get('/documents/:id/preview', requireAdminAuth, streamAdminDocumentFile);
router.delete('/documents/:id', requireAdminAuth, deleteAdminDocument);

// --- PROFILE ---
router.get('/profile', requireAdminAuth, getAdminProfile);
router.put('/profile', requireAdminAuth, updateAdminProfile);

// --- EDUCATION (Schools, Intermediate, Colleges) ---
router.get('/education', requireAdminAuth, getAdminEducation);
router.post('/education', requireAdminAuth, addAdminEducation);
router.put('/education/:id', requireAdminAuth, updateAdminEducation);
router.delete('/education/:id', requireAdminAuth, deleteAdminEducation);

// --- SKILLS ---
router.get('/skills', requireAdminAuth, getAdminSkills);
router.post('/skills', requireAdminAuth, addAdminSkill);
router.put('/skills/:id', requireAdminAuth, updateAdminSkill);
router.delete('/skills/:id', requireAdminAuth, deleteAdminSkill);

// --- PROJECTS ---
router.get('/projects', requireAdminAuth, getAdminProjects);
router.post('/projects', requireAdminAuth, addAdminProject);
router.put('/projects/:id', requireAdminAuth, updateAdminProject);
router.delete('/projects/:id', requireAdminAuth, deleteAdminProject);

// --- CERTIFICATIONS & ACHIEVEMENTS ---
router.get('/certifications', requireAdminAuth, getAdminCertifications);
router.put('/certifications', requireAdminAuth, updateAdminCertifications);
router.get('/achievements', requireAdminAuth, getAdminAchievements);
router.put('/achievements', requireAdminAuth, updateAdminAchievements);

// --- WEBSITE SETTINGS ---
router.get('/settings', requireAdminAuth, getAdminSettings);
router.put('/settings', requireAdminAuth, updateAdminSettings);

// --- AUDIT LOGS & PUBLISHING ---
router.get('/audit-logs', requireAdminAuth, getAdminAuditLogs);
router.post('/publish', requireAdminAuth, publishWebsiteContent);

export default router;
