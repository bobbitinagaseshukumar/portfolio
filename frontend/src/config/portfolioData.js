/**
 * 🌟 PORTFOLIO CENTRAL CONFIGURATION (ZERO FAKE DATA)
 * Real confirmed information only. All educational, project, and certification
 * records are managed dynamically via the Admin Portal and persisted in Supabase.
 */

export const personalData = {
  name: "Nagaseshu Kumar Bobbiti",
  displayName: "Kumar",
  title: "", // Empty until user enters real title in Admin Portal
  headline: "", // Empty until entered
  about: "", // Empty until entered
  location: "India",
  email: "nagaseshukumarbobbiti@gmail.com",
  phone: "",
  resumeUrl: "",
  socials: {
    github: "",
    linkedin: "",
    twitter: "",
    instagram: ""
  },
  stats: [] // Empty until real stats are entered
};

// Clean empty array - populated dynamically via Admin Portal
export const projectsData = [];

// Clean empty array - populated dynamically via Admin Portal
export const skillsData = [];

// Clean empty array - populated dynamically via Admin Portal
export const experienceData = [];
