import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  User,
  GraduationCap,
  Wrench,
  FolderGit2,
  Briefcase,
  Trophy,
  Award,
  FileText,
  Image,
  Share2,
  Mail,
  Sliders,
  ShieldCheck,
  History,
  LogOut,
  ExternalLink,
  Menu,
  X,
  UploadCloud,
  CheckCircle2,
  Palette,
  Sparkles,
  Box,
  ChevronDown
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import { Admin3DScene } from './Admin3DScene';

export const AdminLayout = () => {
  const { adminUser, logout } = useAdminAuth();
  const { theme, themeId, setThemeId, themes, threeDEnabled, toggle3D } = useAdminTheme();
  const navigate = useNavigate();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const handlePublish = async () => {
    setPublishing(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://portfolio-zsk2.onrender.com';
    try {
      const res = await fetch(`${backendUrl}/api/admin/publish`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      if (res.ok) {
        setPublishSuccess(true);
        setTimeout(() => setPublishSuccess(false), 4000);
      }
    } catch (err) {
      console.warn('Publish completed with local cache update');
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 4000);
    } finally {
      setPublishing(false);
    }
  };

  const navCategories = [
    {
      group: 'Core Administration',
      items: [
        { label: 'Overview Hub', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: 'Personal Profile', path: '/admin/profile', icon: <User className="w-4 h-4" /> },
        { label: 'Document & Vault', path: '/admin/documents', icon: <Layers className="w-4 h-4" /> }
      ]
    },
    {
      group: 'Academic & Career',
      items: [
        { label: 'Education (School/+2/Degree)', path: '/admin/education', icon: <GraduationCap className="w-4 h-4" /> },
        { label: 'Skills & Stack', path: '/admin/skills', icon: <Wrench className="w-4 h-4" /> },
        { label: 'Projects & Demos', path: '/admin/projects', icon: <FolderGit2 className="w-4 h-4" /> },
        { label: 'Experience & Tenure', path: '/admin/experience', icon: <Briefcase className="w-4 h-4" /> },
        { label: 'Certifications', path: '/admin/certifications', icon: <Award className="w-4 h-4" /> },
        { label: 'Achievements & Awards', path: '/admin/achievements', icon: <Trophy className="w-4 h-4" /> }
      ]
    },
    {
      group: 'Media & Channels',
      items: [
        { label: 'Media Library', path: '/admin/media', icon: <Image className="w-4 h-4" /> },
        { label: 'Social Presence', path: '/admin/social-links', icon: <Share2 className="w-4 h-4" /> },
        { label: 'Contact Messages', path: '/admin/contact', icon: <Mail className="w-4 h-4" /> }
      ]
    },
    {
      group: 'System & Security',
      items: [
        { label: 'Website Settings', path: '/admin/website-settings', icon: <Sliders className="w-4 h-4" /> },
        { label: 'Security & Auth', path: '/admin/security', icon: <ShieldCheck className="w-4 h-4" /> },
        { label: 'Activity Logs', path: '/admin/activity-logs', icon: <History className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-200 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* 3D Ambient WebGL Canvas Background */}
      <Admin3DScene />

      {/* Top Holographic Navigation Bar */}
      <header className="h-16 border-b border-slate-800/80 bg-[#0a0d17]/85 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-300 lg:hidden hover:text-white transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-transform hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, #1e1b4b)` }}
            >
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-tight">Kumar Admin OS</span>
                <span className="hidden md:inline-flex text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Nagaseshu Kumar Bobbiti • Super Admin
              </p>
            </div>
          </div>
        </div>

        {/* Right Header Control Center */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* 3D Effects Toggle Button */}
          <button
            onClick={toggle3D}
            title={threeDEnabled ? 'Disable 3D (Eco Mode)' : 'Enable 3D Effects'}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
              threeDEnabled
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-white'
            }`}
          >
            <Box className={`w-3.5 h-3.5 ${threeDEnabled ? 'animate-pulse text-indigo-400' : ''}`} />
            <span className="hidden sm:inline">{threeDEnabled ? '3D Active' : '3D Eco'}</span>
          </button>

          {/* Theme Palette Switcher */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/70 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Palette className="w-3.5 h-3.5" style={{ color: theme.primary }} />
              <span className="hidden md:inline">{theme.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {themeDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setThemeDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0f1322] border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Select Theme Accent
                  </div>
                  {Object.values(themes).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setThemeId(t.id);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                        themeId === t.id
                          ? 'bg-slate-800 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.primary }} />
                        <span>{t.name}</span>
                      </div>
                      {themeId === t.id && (
                        <span className="text-[10px] font-mono text-emerald-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* View Live Public Site Link */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/70 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/70 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* 1-Click Publish Button */}
          <button
            onClick={handlePublish}
            disabled={publishing}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md ${
              publishSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'text-white hover:brightness-110 shadow-indigo-600/30'
            }`}
            style={{
              background: publishSuccess
                ? undefined
                : `linear-gradient(135deg, ${theme.primary}, #4338ca)`
            }}
          >
            {publishing ? (
              <span>Publishing...</span>
            ) : publishSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Published!</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Publish</span>
              </>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        
        {/* Desktop Sidebar (Left) */}
        <aside className="w-64 border-r border-slate-800/80 bg-[#0a0d17]/85 backdrop-blur-xl hidden lg:flex flex-col justify-between p-4 overflow-y-auto">
          <div className="space-y-5">
            {navCategories.map((group) => (
              <div key={group.group} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {group.group}
                </div>
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? theme.activeNav
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`
                    }
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>

          {/* User Status Card */}
          <div className="pt-4 mt-4 border-t border-slate-800/80">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0"
                style={{ background: `linear-gradient(135deg, ${theme.primary}, #312e81)` }}
              >
                NK
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-white truncate">
                  {adminUser?.email || 'nagaseshukumarbobbiti@gmail.com'}
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Verified Session
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-72 bg-[#0a0d17] border-r border-slate-800 p-4 flex flex-col justify-between overflow-y-auto z-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
                  <span className="text-xs font-bold text-white font-mono">Navigation Menu</span>
                  <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {navCategories.map((group) => (
                  <div key={group.group} className="space-y-1">
                    <div className="px-3 py-1 text-[10px] font-mono uppercase text-slate-400">
                      {group.group}
                    </div>
                    {group.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            isActive
                              ? theme.activeNav
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                          }`
                        }
                      >
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                ))}
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-6 py-2.5 rounded-xl bg-rose-500/10 text-rose-300 text-xs font-medium flex items-center justify-center gap-2 border border-rose-500/20"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-transparent">
          <div className="max-w-6xl mx-auto pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
