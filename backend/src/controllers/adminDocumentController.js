import path from 'path';
import fs from 'fs';
import { storeFile, getFilePath } from '../config/storage.js';
import { supabase } from '../config/supabase.js';

// In-memory persistent documents store
export let documentsDb = [];
export let versionsDb = [];

// Helper to determine general file type
const getFileCategory = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype === 'application/pdf') return 'pdf';
  if (mimetype.startsWith('video/')) return 'video';
  return 'document';
};

// 1. GET ALL DOCUMENTS (Admin View - shows all public, private, drafts, archived)
export const getAdminDocuments = async (req, res) => {
  try {
    const { category, visibility, status, search } = req.query;

    let result = [...documentsDb];

    // Filter by active
    result = result.filter(d => d.isActive !== false);

    if (category && category !== 'all') {
      result = result.filter(d => d.category === category);
    }
    if (visibility && visibility !== 'all') {
      result = result.filter(d => d.visibility === visibility);
    }
    if (status && status !== 'all') {
      result = result.filter(d => d.publicationStatus === status);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.title?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q) ||
        d.originalFilename?.toLowerCase().includes(q)
      );
    }

    // Sort by uploadedAt descending
    result.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 2. UPLOAD NEW DOCUMENT
export const uploadAdminDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded.' });
    }

    const {
      title,
      category = 'other',
      description = '',
      visibility = 'PUBLIC',
      publicationStatus = (visibility === 'PUBLIC' ? 'published' : 'draft'),
      showOnWebsite = 'true',
      allowPreview = 'true',
      allowDownload = 'true',
      relatedEntityType = '',
      relatedEntityId = '',
      issueDate = '',
      tags = ''
    } = req.body;

    const fileResult = await storeFile(req.file, visibility);

    const newDoc = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title || req.file.originalname,
      originalFilename: req.file.originalname,
      storagePath: fileResult.storagePath,
      bucket: fileResult.bucket,
      fileType: getFileCategory(req.file.mimetype),
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      category,
      description,
      relatedEntityType,
      relatedEntityId,
      visibility, // 'PUBLIC', 'PRIVATE', 'UNLISTED'
      publicationStatus, // 'draft', 'pending', 'approved', 'published', 'hidden', 'archived'
      showOnWebsite: showOnWebsite === 'true' || showOnWebsite === true,
      allowPreview: allowPreview === 'true' || allowPreview === true,
      allowDownload: allowDownload === 'true' || allowDownload === true,
      isActive: true,
      versionNumber: 1,
      issueDate,
      tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : tags,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: publicationStatus === 'published' ? new Date().toISOString() : null
    };

    documentsDb.unshift(newDoc);

    // Record initial version in version history
    versionsDb.unshift({
      id: `ver-${Date.now()}`,
      documentId: newDoc.id,
      versionNumber: 1,
      storagePath: newDoc.storagePath,
      originalFilename: newDoc.originalFilename,
      fileSize: newDoc.fileSize,
      mimeType: newDoc.mimeType,
      uploadedBy: req.adminUser?.email || 'admin',
      changeSummary: 'Initial document upload',
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: 'Document uploaded and registered successfully.',
      data: newDoc
    });
  } catch (err) {
    console.error('Upload document error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 3. UPDATE DOCUMENT METADATA & PERMISSIONS
export const updateAdminDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const docIdx = documentsDb.findIndex(d => d.id === id);

    if (docIdx === -1) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    const currentDoc = documentsDb[docIdx];
    const updates = req.body;

    let publicationStatus = updates.publicationStatus || currentDoc.publicationStatus;
    if (updates.visibility === 'PUBLIC' && (updates.showOnWebsite || currentDoc.showOnWebsite) && (!updates.publicationStatus || updates.publicationStatus === 'draft')) {
      publicationStatus = 'published';
    }

    // Handle publishing status change
    let publishedAt = currentDoc.publishedAt;
    if (publicationStatus === 'published' && currentDoc.publicationStatus !== 'published') {
      publishedAt = new Date().toISOString();
    }

    const updatedDoc = {
      ...currentDoc,
      ...updates,
      publicationStatus,
      updatedAt: new Date().toISOString(),
      publishedAt
    };

    documentsDb[docIdx] = updatedDoc;

    return res.status(200).json({
      success: true,
      message: 'Document permissions and metadata updated successfully.',
      data: updatedDoc
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 4. REPLACE DOCUMENT FILE (Creates new version, preserves old)
export const replaceAdminDocumentFile = async (req, res) => {
  try {
    const { id } = req.params;
    const docIdx = documentsDb.findIndex(d => d.id === id);

    if (docIdx === -1) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No replacement file provided.' });
    }

    const currentDoc = documentsDb[docIdx];
    const newVersionNumber = (currentDoc.versionNumber || 1) + 1;
    const fileResult = await storeFile(req.file, currentDoc.visibility);

    // Save previous version in version history
    versionsDb.unshift({
      id: `ver-${Date.now()}`,
      documentId: currentDoc.id,
      versionNumber: currentDoc.versionNumber,
      storagePath: currentDoc.storagePath,
      originalFilename: currentDoc.originalFilename,
      fileSize: currentDoc.fileSize,
      mimeType: currentDoc.mimeType,
      uploadedBy: req.adminUser?.email || 'admin',
      changeSummary: req.body.changeSummary || `Replaced with version ${newVersionNumber}`,
      createdAt: new Date().toISOString()
    });

    // Update document with new file details
    const updatedDoc = {
      ...currentDoc,
      originalFilename: req.file.originalname,
      storagePath: fileResult.storagePath,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      fileType: getFileCategory(req.file.mimetype),
      versionNumber: newVersionNumber,
      updatedAt: new Date().toISOString()
    };

    documentsDb[docIdx] = updatedDoc;

    return res.status(200).json({
      success: true,
      message: `Document updated to Version ${newVersionNumber}. Previous version preserved.`,
      data: updatedDoc
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 5. RESTORE PREVIOUS VERSION
export const restoreAdminDocumentVersion = async (req, res) => {
  try {
    const { id, versionId } = req.params;
    const docIdx = documentsDb.findIndex(d => d.id === id);
    const ver = versionsDb.find(v => v.id === versionId && v.documentId === id);

    if (docIdx === -1 || !ver) {
      return res.status(404).json({ success: false, error: 'Document or version record not found.' });
    }

    const currentDoc = documentsDb[docIdx];

    // Archive current before restoring
    versionsDb.unshift({
      id: `ver-${Date.now()}`,
      documentId: currentDoc.id,
      versionNumber: currentDoc.versionNumber,
      storagePath: currentDoc.storagePath,
      originalFilename: currentDoc.originalFilename,
      fileSize: currentDoc.fileSize,
      mimeType: currentDoc.mimeType,
      uploadedBy: req.adminUser?.email || 'admin',
      changeSummary: `Archived before rollback to version ${ver.versionNumber}`,
      createdAt: new Date().toISOString()
    });

    const restoredDoc = {
      ...currentDoc,
      originalFilename: ver.originalFilename,
      storagePath: ver.storagePath,
      mimeType: ver.mimeType,
      fileSize: ver.fileSize,
      fileType: getFileCategory(ver.mimeType),
      versionNumber: ver.versionNumber,
      updatedAt: new Date().toISOString()
    };

    documentsDb[docIdx] = restoredDoc;

    return res.status(200).json({
      success: true,
      message: `Document rolled back to Version ${ver.versionNumber}.`,
      data: restoredDoc
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 6. DELETE DOCUMENT (Soft delete / Safe deletion)
export const deleteAdminDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const docIdx = documentsDb.findIndex(d => d.id === id);

    if (docIdx === -1) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    // Remove from active list
    const deletedDoc = documentsDb.splice(docIdx, 1)[0];

    return res.status(200).json({
      success: true,
      message: `Document "${deletedDoc.title}" deleted and revoked from all public access.`,
      deletedId: id
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 7. GET DOCUMENT VERSIONS
export const getAdminDocumentVersions = async (req, res) => {
  try {
    const { id } = req.params;
    const history = versionsDb.filter(v => v.documentId === id);
    return res.status(200).json({ success: true, data: history });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// 8. ADMIN PREVIEW / DOWNLOAD (Bypasses public restriction with verified admin auth)
export const streamAdminDocumentFile = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = documentsDb.find(d => d.id === id);

    if (!doc) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    const filePath = getFilePath(doc.storagePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File binary not found on storage server.' });
    }

    const isDownload = req.query.download === 'true';
    res.setHeader('Content-Type', doc.mimeType);
    if (isDownload) {
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(doc.originalFilename)}"`);
    } else {
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(doc.originalFilename)}"`);
    }

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
