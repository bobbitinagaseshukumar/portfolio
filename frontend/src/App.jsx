import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import { AdminProtectedRoute } from './admin/components/AdminProtectedRoute';
import { AdminLayout } from './admin/components/AdminLayout';

// Admin Management Pages
import { AdminLogin } from './admin/pages/AdminLogin';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { AdminDocuments } from './admin/pages/AdminDocuments';
import { AdminProfile } from './admin/pages/AdminProfile';
import { AdminEducation } from './admin/pages/AdminEducation';
import { AdminSkills } from './admin/pages/AdminSkills';
import { AdminProjects } from './admin/pages/AdminProjects';
import { AdminExperience } from './admin/pages/AdminExperience';
import { AdminAchievements } from './admin/pages/AdminAchievements';
import { AdminCertifications } from './admin/pages/AdminCertifications';
import { AdminMedia } from './admin/pages/AdminMedia';
import { AdminSocials } from './admin/pages/AdminSocials';
import { AdminContactInbox } from './admin/pages/AdminContactInbox';
import { AdminSettings } from './admin/pages/AdminSettings';
import { AdminSecurity } from './admin/pages/AdminSecurity';
import { AdminActivityLogs } from './admin/pages/AdminActivityLogs';

// Public 3D Portfolio Components (Loaded ONLY on public route, not in admin!)
import { SceneBackground } from './components/3d/SceneBackground';
import { Navbar } from './components/ui/Navbar';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Education } from './components/sections/Education';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Documents } from './components/sections/Documents';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/ui/Footer';

// Public Experience Component (Zero Fake Data • Live Synchronized)
const PublicPortfolio = () => {
  return (
    <div className="relative min-h-screen bg-[#07080d] text-white selection:bg-indigo-500 selection:text-white">
      {/* 3D WebGL Canvas Background */}
      <SceneBackground />

      {/* Main UI Layer */}
      <div className="relative z-10 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <About />
          <Education />
          <Skills />
          <Projects />
          <Documents />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. Public 3D Cinematic Portfolio */}
          <Route path="/" element={<PublicPortfolio />} />

          {/* 2. Admin Authentication Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 3. Protected Private Admin Management Portal */}
          <Route path="/admin" element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="documents" element={<AdminDocuments />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="education" element={<AdminEducation />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="experience" element={<AdminExperience />} />
              <Route path="achievements" element={<AdminAchievements />} />
              <Route path="certifications" element={<AdminCertifications />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="social-links" element={<AdminSocials />} />
              <Route path="contact" element={<AdminContactInbox />} />
              <Route path="website-settings" element={<AdminSettings />} />
              <Route path="security" element={<AdminSecurity />} />
              <Route path="activity-logs" element={<AdminActivityLogs />} />
            </Route>
          </Route>

          {/* 4. Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
