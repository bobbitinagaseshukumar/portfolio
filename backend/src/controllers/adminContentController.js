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

// ---------------- CERTIFICATIONS ----------------
export const getAdminCertifications = async (req, res) => res.status(200).json({ success: true, data: portfolioStore.certifications || [] });
export const addAdminCertification = async (req, res) => {
  const newCert = {
    id: `cert-${Date.now()}`,
    isPublished: true,
    displayOrder: (portfolioStore.certifications?.length || 0) + 1,
    ...req.body
  };
  portfolioStore.certifications = portfolioStore.certifications || [];
  portfolioStore.certifications.push(newCert);
  logAuditAction(req.adminUser?.email, "CERTIFICATION_ADDED", "CERTIFICATION", newCert.id, newCert);
  return res.status(201).json({ success: true, message: "Certification added.", data: newCert });
};
export const updateAdminCertification = async (req, res) => {
  const { id } = req.params;
  const list = portfolioStore.certifications || [];
  const idx = list.findIndex(c => c.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...req.body };
    logAuditAction(req.adminUser?.email, "CERTIFICATION_UPDATED", "CERTIFICATION", id, req.body);
    return res.status(200).json({ success: true, message: "Certification updated.", data: list[idx] });
  }
  return res.status(404).json({ success: false, error: "Certification not found." });
};
export const deleteAdminCertification = async (req, res) => {
  const { id } = req.params;
  portfolioStore.certifications = (portfolioStore.certifications || []).filter(c => c.id !== id);
  logAuditAction(req.adminUser?.email, "CERTIFICATION_DELETED", "CERTIFICATION", id);
  return res.status(200).json({ success: true, message: "Certification deleted." });
};

// ---------------- ACHIEVEMENTS ----------------
export const getAdminAchievements = async (req, res) => res.status(200).json({ success: true, data: portfolioStore.achievements || [] });
export const addAdminAchievement = async (req, res) => {
  const newAch = {
    id: `ach-${Date.now()}`,
    isPublished: true,
    displayOrder: (portfolioStore.achievements?.length || 0) + 1,
    ...req.body
  };
  portfolioStore.achievements = portfolioStore.achievements || [];
  portfolioStore.achievements.push(newAch);
  logAuditAction(req.adminUser?.email, "ACHIEVEMENT_ADDED", "ACHIEVEMENT", newAch.id, newAch);
  return res.status(201).json({ success: true, message: "Achievement added.", data: newAch });
};
export const updateAdminAchievement = async (req, res) => {
  const { id } = req.params;
  const list = portfolioStore.achievements || [];
  const idx = list.findIndex(a => a.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...req.body };
    logAuditAction(req.adminUser?.email, "ACHIEVEMENT_UPDATED", "ACHIEVEMENT", id, req.body);
    return res.status(200).json({ success: true, message: "Achievement updated.", data: list[idx] });
  }
  return res.status(404).json({ success: false, error: "Achievement not found." });
};
export const deleteAdminAchievement = async (req, res) => {
  const { id } = req.params;
  portfolioStore.achievements = (portfolioStore.achievements || []).filter(a => a.id !== id);
  logAuditAction(req.adminUser?.email, "ACHIEVEMENT_DELETED", "ACHIEVEMENT", id);
  return res.status(200).json({ success: true, message: "Achievement deleted." });
};

// ---------------- EXPERIENCES & INTERNSHIPS ----------------
export const getAdminExperiences = async (req, res) => res.status(200).json({ success: true, data: portfolioStore.experiences || [] });
export const addAdminExperience = async (req, res) => {
  const newExp = {
    id: `exp-${Date.now()}`,
    isPublished: true,
    displayOrder: (portfolioStore.experiences?.length || 0) + 1,
    ...req.body
  };
  portfolioStore.experiences = portfolioStore.experiences || [];
  portfolioStore.experiences.push(newExp);
  logAuditAction(req.adminUser?.email, "EXPERIENCE_ADDED", "EXPERIENCE", newExp.id, newExp);
  return res.status(201).json({ success: true, message: "Experience record added.", data: newExp });
};
export const updateAdminExperience = async (req, res) => {
  const { id } = req.params;
  const list = portfolioStore.experiences || [];
  const idx = list.findIndex(e => e.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...req.body };
    logAuditAction(req.adminUser?.email, "EXPERIENCE_UPDATED", "EXPERIENCE", id, req.body);
    return res.status(200).json({ success: true, message: "Experience record updated.", data: list[idx] });
  }
  return res.status(404).json({ success: false, error: "Experience record not found." });
};
export const deleteAdminExperience = async (req, res) => {
  const { id } = req.params;
  portfolioStore.experiences = (portfolioStore.experiences || []).filter(e => e.id !== id);
  logAuditAction(req.adminUser?.email, "EXPERIENCE_DELETED", "EXPERIENCE", id);
  return res.status(200).json({ success: true, message: "Experience record deleted." });
};

// ---------------- SOCIAL LINKS ----------------
export const getAdminSocialLinks = async (req, res) => res.status(200).json({ success: true, data: portfolioStore.socialLinks || [] });
export const addAdminSocialLink = async (req, res) => {
  const newSocial = {
    id: `soc-${Date.now()}`,
    isEnabled: true,
    ...req.body
  };
  portfolioStore.socialLinks = portfolioStore.socialLinks || [];
  portfolioStore.socialLinks.push(newSocial);
  logAuditAction(req.adminUser?.email, "SOCIAL_LINK_ADDED", "SOCIAL", newSocial.id, newSocial);
  return res.status(201).json({ success: true, message: "Social link added.", data: newSocial });
};
export const updateAdminSocialLink = async (req, res) => {
  const { id } = req.params;
  const list = portfolioStore.socialLinks || [];
  const idx = list.findIndex(s => s.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...req.body };
    logAuditAction(req.adminUser?.email, "SOCIAL_LINK_UPDATED", "SOCIAL", id, req.body);
    return res.status(200).json({ success: true, message: "Social link updated.", data: list[idx] });
  }
  return res.status(404).json({ success: false, error: "Social link not found." });
};
export const deleteAdminSocialLink = async (req, res) => {
  const { id } = req.params;
  portfolioStore.socialLinks = (portfolioStore.socialLinks || []).filter(s => s.id !== id);
  logAuditAction(req.adminUser?.email, "SOCIAL_LINK_DELETED", "SOCIAL", id);
  return res.status(200).json({ success: true, message: "Social link deleted." });
};

// ---------------- PURGE ALL PREVIOUS CONTENTS (Clean Reset) ----------------
export const purgePreviousContents = async (req, res) => {
  portfolioStore.education = [];
  portfolioStore.skills = [];
  portfolioStore.projects = [];
  portfolioStore.experiences = [];
  portfolioStore.certifications = [];
  portfolioStore.achievements = [];
  portfolioStore.socialLinks = [];
  
  // Reset profile to clean Nagaseshu Kumar Bobbiti baseline with zero fake data
  portfolioStore.profile = {
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
  };

  logAuditAction(req.adminUser?.email, "DATABASE_PURGED", "SYSTEM", "all", {
    reason: "User requested clean database wipe of all previous contents."
  });

  return res.status(200).json({
    success: true,
    message: "🧹 Clean database wipe completed! All previous contents removed. System is ready for your real content.",
    data: portfolioStore
  });
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
