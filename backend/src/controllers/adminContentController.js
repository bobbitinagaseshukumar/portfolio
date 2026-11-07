import { portfolioStore } from './publicContentController.js';
import { documentsDb } from './adminDocumentController.js';

let auditLogs = [
  {
    id: `log-${Date.now()}`,
    action: "SYSTEM_INITIALIZED",
    entityType: "SYSTEM",
    timestamp: new Date().toISOString(),
    adminEmail: "nagaseshukumarbobbiti@gmail.com",
    details: { message: "Clean production portfolio initialized with zero fake data." }
  }
];

export const logAuditAction = (email, action, entityType, entityId, details = {}) => {
  auditLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    adminEmail: email || "nagaseshukumarbobbiti@gmail.com",
    action,
    entityType,
    entityId,
    details,
    timestamp: new Date().toISOString()
  });
};

// ---------------- DASHBOARD OVERVIEW ----------------
export const getAdminDashboardStats = async (req, res) => {
  const publicDocsCount = documentsDb.filter(d => d.visibility === 'PUBLIC' && d.publicationStatus === 'published').length;
  const privateDocsCount = documentsDb.filter(d => d.visibility === 'PRIVATE').length;
  const pendingDocsCount = documentsDb.filter(d => d.publicationStatus === 'pending' || d.publicationStatus === 'draft').length;

  return res.status(200).json({
    success: true,
    data: {
      totalDocuments: documentsDb.length,
      publicDocuments: publicDocsCount,
      privateDocuments: privateDocsCount,
      pendingDocuments: pendingDocsCount,
      totalProjects: portfolioStore.projects.length,
      publishedProjects: portfolioStore.projects.filter(p => p.isPublished).length,
      totalSkills: portfolioStore.skills.length,
      educationCount: portfolioStore.education.length,
      certificationsCount: portfolioStore.certifications.length,
      achievementsCount: portfolioStore.achievements.length,
      lastUpdated: new Date().toISOString(),
      profile: {
        name: portfolioStore.profile.displayName || portfolioStore.profile.fullName,
        title: portfolioStore.profile.developerTitle || 'Not set yet',
        college: portfolioStore.profile.collegeName || 'Not set yet'
      }
    }
  });
};

// ---------------- PROFILE ----------------
export const getAdminProfile = async (req, res) => {
  return res.status(200).json({ success: true, data: portfolioStore.profile });
};

export const updateAdminProfile = async (req, res) => {
  portfolioStore.profile = { ...portfolioStore.profile, ...req.body };
  logAuditAction(req.adminUser?.email, "PROFILE_UPDATED", "PROFILE", "profile", req.body);
  return res.status(200).json({ success: true, message: "Profile updated successfully.", data: portfolioStore.profile });
};

// ---------------- EDUCATION (Schools, Intermediate, Colleges) ----------------
export const getAdminEducation = async (req, res) => {
  return res.status(200).json({ success: true, data: portfolioStore.education });
};

export const addAdminEducation = async (req, res) => {
  const newRecord = {
    id: `edu-${Date.now()}`,
    isPublished: true,
    ...req.body
  };
  portfolioStore.education.push(newRecord);
  logAuditAction(req.adminUser?.email, "EDUCATION_ADDED", "EDUCATION", newRecord.id, newRecord);
  return res.status(201).json({ success: true, message: "Education record added.", data: newRecord });
};

export const updateAdminEducation = async (req, res) => {
  const { id } = req.params;
  const idx = portfolioStore.education.findIndex(e => e.id === id);
  if (idx !== -1) {
    portfolioStore.education[idx] = { ...portfolioStore.education[idx], ...req.body };
    logAuditAction(req.adminUser?.email, "EDUCATION_UPDATED", "EDUCATION", id, req.body);
    return res.status(200).json({ success: true, message: "Education record updated.", data: portfolioStore.education[idx] });
  }
  return res.status(404).json({ success: false, error: "Education record not found." });
};

export const deleteAdminEducation = async (req, res) => {
  const { id } = req.params;
  portfolioStore.education = portfolioStore.education.filter(e => e.id !== id);
  logAuditAction(req.adminUser?.email, "EDUCATION_DELETED", "EDUCATION", id);
  return res.status(200).json({ success: true, message: "Education record deleted." });
};

// ---------------- SKILLS ----------------
export const getAdminSkills = async (req, res) => {
  return res.status(200).json({ success: true, data: portfolioStore.skills });
};

export const addAdminSkill = async (req, res) => {
  const newSkill = {
    id: `s-${Date.now()}`,
    isPublished: true,
    ...req.body
  };
  portfolioStore.skills.push(newSkill);
  logAuditAction(req.adminUser?.email, "SKILL_ADDED", "SKILL", newSkill.id, newSkill);
  return res.status(201).json({ success: true, message: "Skill added.", data: newSkill });
};

export const updateAdminSkill = async (req, res) => {
  const { id } = req.params;
  const idx = portfolioStore.skills.findIndex(s => s.id === id);
  if (idx !== -1) {
    portfolioStore.skills[idx] = { ...portfolioStore.skills[idx], ...req.body };
    return res.status(200).json({ success: true, message: "Skill updated.", data: portfolioStore.skills[idx] });
  }
  return res.status(404).json({ success: false, error: "Skill not found." });
};

export const deleteAdminSkill = async (req, res) => {
  const { id } = req.params;
  portfolioStore.skills = portfolioStore.skills.filter(s => s.id !== id);
  return res.status(200).json({ success: true, message: "Skill deleted." });
};

// ---------------- PROJECTS ----------------
export const getAdminProjects = async (req, res) => {
  return res.status(200).json({ success: true, data: portfolioStore.projects });
};

export const addAdminProject = async (req, res) => {
  const newProject = {
    id: `proj-${Date.now()}`,
    isPublished: true,
    ...req.body
  };
  portfolioStore.projects.push(newProject);
  logAuditAction(req.adminUser?.email, "PROJECT_CREATED", "PROJECT", newProject.id, { title: newProject.title });
  return res.status(201).json({ success: true, message: "Project created.", data: newProject });
};

export const updateAdminProject = async (req, res) => {
  const { id } = req.params;
  const idx = portfolioStore.projects.findIndex(p => p.id === id);
  if (idx !== -1) {
    portfolioStore.projects[idx] = { ...portfolioStore.projects[idx], ...req.body };
    logAuditAction(req.adminUser?.email, "PROJECT_UPDATED", "PROJECT", id, { title: portfolioStore.projects[idx].title });
    return res.status(200).json({ success: true, message: "Project updated.", data: portfolioStore.projects[idx] });
  }
  return res.status(404).json({ success: false, error: "Project not found." });
};

export const deleteAdminProject = async (req, res) => {
  const { id } = req.params;
  portfolioStore.projects = portfolioStore.projects.filter(p => p.id !== id);
  logAuditAction(req.adminUser?.email, "PROJECT_DELETED", "PROJECT", id);
  return res.status(200).json({ success: true, message: "Project deleted." });
};

// ---------------- CERTIFICATIONS & ACHIEVEMENTS ----------------
export const getAdminCertifications = async (req, res) => res.status(200).json({ success: true, data: portfolioStore.certifications });
export const updateAdminCertifications = async (req, res) => {
  portfolioStore.certifications = req.body;
  logAuditAction(req.adminUser?.email, "CERTIFICATIONS_UPDATED", "CERTIFICATIONS", "all");
  return res.status(200).json({ success: true, message: "Certifications updated.", data: portfolioStore.certifications });
};

export const getAdminAchievements = async (req, res) => res.status(200).json({ success: true, data: portfolioStore.achievements });
export const updateAdminAchievements = async (req, res) => {
  portfolioStore.achievements = req.body;
  logAuditAction(req.adminUser?.email, "ACHIEVEMENTS_UPDATED", "ACHIEVEMENTS", "all");
  return res.status(200).json({ success: true, message: "Achievements updated.", data: portfolioStore.achievements });
};

// ---------------- SETTINGS ----------------
export const getAdminSettings = async (req, res) => res.status(200).json({ success: true, data: portfolioStore.settings });
export const updateAdminSettings = async (req, res) => {
  portfolioStore.settings = { ...portfolioStore.settings, ...req.body };
  logAuditAction(req.adminUser?.email, "SETTINGS_UPDATED", "SETTINGS", "settings");
  return res.status(200).json({ success: true, message: "Settings updated.", data: portfolioStore.settings });
};

// ---------------- AUDIT LOGS ----------------
export const getAdminAuditLogs = async (req, res) => {
  return res.status(200).json({ success: true, data: auditLogs });
};

// ---------------- 1-CLICK SAVE & PUBLISH ----------------
export const publishWebsiteContent = async (req, res) => {
  logAuditAction(req.adminUser?.email, "PUBLISH_WEBSITE", "WEBSITE", "all", { timestamp: new Date().toISOString() });
  return res.status(200).json({
    success: true,
    message: "🎉 All modifications published live! Visitors will now see the latest updates instantly.",
    publishedAt: new Date().toISOString()
  });
};
