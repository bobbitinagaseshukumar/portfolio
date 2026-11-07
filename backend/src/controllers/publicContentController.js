import path from 'path';
import fs from 'fs';
import { documentsDb } from './adminDocumentController.js';
import { getFilePath } from '../config/storage.js';

// Central single source of truth for portfolio content (ZERO fake data)
export let portfolioStore = {
  profile: {
    fullName: "Nagaseshu Kumar Bobbiti",
    displayName: "Kumar",
    developerTitle: "",
    shortIntro: "",
    biography: "",
    email: "nagaseshukumarbobbiti@gmail.com",
    phone: "",
    location: "India",
    country: "India",
    currentRole: "",
    specialization: "",
    learningFocus: "",
    careerObjective: "",
    availability: "available",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    // Real academic fields (empty until user enters them)
    collegeName: "",
    schoolName: "",
    degree: "",
    branch: "",
    academicYear: "",
    startYear: "",
    completionYear: "",
    cgpa: "",
    academicDescription: "",
    isPublished: true
  },
  education: [], // Clean empty array (no fake schools or colleges)
  skills: [], // Clean empty array (no fake unverified skills)
  projects: [], // Clean empty array (no fake projects)
  experiences: [], // Clean empty array (no fake internships/work history)
  certifications: [], // Clean empty array (no fake certificates)
  achievements: [], // Clean empty array (no fake awards)
  socialLinks: [],
  settings: {
    siteName: "Kumar Portfolio",
    siteDescription: "3D Interactive Portfolio",
    seoTitle: "Kumar | Portfolio",
    copyrightText: "© 2026 Kumar. All rights reserved.",
    maintenanceMode: false,
    hero3dEnabled: true,
    heroRevealText: "Kumar",
    developerTitleReveal: "",
    loadingScreenText: "Loading Portfolio..."
  }
};

// 1. GET COMPLETE PUBLIC PORTFOLIO DATA (Synchronized live source of truth)
export const getPublicPortfolio = (req, res) => {
  // Filter documents strictly: PUBLIC + PUBLISHED + SHOW_ON_WEBSITE + ACTIVE
  const approvedPublicDocuments = documentsDb
    .filter(d =>
      d.isActive !== false &&
      d.visibility === 'PUBLIC' &&
      d.publicationStatus === 'published' &&
      d.showOnWebsite === true
    )
    .map(d => ({
      id: d.id,
      title: d.title,
      category: d.category,
      description: d.description,
      fileType: d.fileType,
      fileSize: d.fileSize,
      issueDate: d.issueDate,
      tags: d.tags,
      allowPreview: d.allowPreview,
      allowDownload: d.allowDownload,
      previewUrl: `/api/public/documents/${d.id}/preview`,
      downloadUrl: `/api/public/documents/${d.id}/download`,
      publishedAt: d.publishedAt
    }));

  return res.status(200).json({
    success: true,
    data: {
      profile: portfolioStore.profile,
      education: portfolioStore.education.filter(e => e.isPublished),
      skills: portfolioStore.skills.filter(s => s.isPublished),
      projects: portfolioStore.projects.filter(p => p.isPublished),
      experiences: portfolioStore.experiences.filter(exp => exp.isPublished),
      certifications: portfolioStore.certifications.filter(c => c.isPublished),
      achievements: portfolioStore.achievements.filter(a => a.isPublished),
      documents: approvedPublicDocuments,
      socialLinks: portfolioStore.socialLinks.filter(s => s.isEnabled),
      settings: portfolioStore.settings
    }
  });
};

// 2. GET PUBLIC DOCUMENTS LIST
export const getPublicDocuments = (req, res) => {
  const { category } = req.query;
  let docs = documentsDb.filter(d =>
    d.isActive !== false &&
    d.visibility === 'PUBLIC' &&
    (d.publicationStatus === 'published' || !d.publicationStatus || d.publicationStatus === 'approved') &&
    (d.showOnWebsite === true || d.showOnWebsite === 'true')
  );

  if (category && category !== 'all') {
    docs = docs.filter(d => d.category === category);
  }

  const sanitized = docs.map(d => ({
    id: d.id,
    title: d.title,
    category: d.category,
    description: d.description,
    fileType: d.fileType,
    fileSize: d.fileSize,
    issueDate: d.issueDate,
    allowPreview: d.allowPreview,
    allowDownload: d.allowDownload,
    previewUrl: `/api/public/documents/${d.id}/preview`,
    downloadUrl: `/api/public/documents/${d.id}/download`
  }));

  return res.status(200).json({ success: true, count: sanitized.length, data: sanitized });
};

// 3. PUBLIC PREVIEW FILE (Strictly enforces visibility & allow_preview permissions)
export const previewPublicDocument = (req, res) => {
  try {
    const { id } = req.params;
    const doc = documentsDb.find(d => d.id === id);

    // 1. Check existence
    if (!doc || doc.isActive === false) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    // 2. Enforce Visibility Rule: MUST BE PUBLIC
    if (doc.visibility !== 'PUBLIC') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: This document is classified as PRIVATE or UNLISTED. Public access is denied.'
      });
    }

    // 3. Enforce Publication Status: MUST BE PUBLISHED
    if (doc.publicationStatus && !['published', 'approved'].includes(doc.publicationStatus)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: This document has not been approved or published for public viewing.'
      });
    }

    // 4. Enforce Granular Permission: ALLOW PREVIEW
    if (!doc.allowPreview) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Online preview has been disabled for this credential by the administrator.'
      });
    }

    const filePath = getFilePath(doc.storagePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File binary unavailable on storage server.' });
    }

    res.setHeader('Content-Type', doc.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(doc.originalFilename)}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 4. PUBLIC DOWNLOAD FILE (Strictly enforces visibility & allow_download permissions)
export const downloadPublicDocument = (req, res) => {
  try {
    const { id } = req.params;
    const doc = documentsDb.find(d => d.id === id);

    if (!doc || doc.isActive === false) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    if (doc.visibility !== 'PUBLIC') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: This document is classified as PRIVATE. Public downloads are denied.'
      });
    }

    if (doc.publicationStatus !== 'published') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: This document is not approved for public download.'
      });
    }

    if (!doc.allowDownload) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Public download has been explicitly disabled for this document.'
      });
    }

    const filePath = getFilePath(doc.storagePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File binary unavailable.' });
    }

    res.setHeader('Content-Type', doc.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(doc.originalFilename)}"`);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
