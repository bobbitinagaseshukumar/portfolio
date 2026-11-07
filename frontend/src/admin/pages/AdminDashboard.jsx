import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Wrench,
  GraduationCap,
  Award,
  Trophy,
  ArrowRight,
  User,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Database,
  ExternalLink,
  BookOpen,
  Briefcase,
  Share2,
  Settings,
  Server,
  Layers,
  FileCheck,
  ShieldAlert,
  Copy,
  Check,
  Trash2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminTheme } from '../context/AdminThemeContext';
import { Admin3DHeroWidget } from '../components/Admin3DHeroWidget';

export const AdminDashboard = () => {
  const { adminUser } = useAdminAuth();
  const { theme } = useAdminTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedDbString, setCopiedDbString] = useState(false);
  const [purging, setPurging] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://portfolio-zsk2.onrender.com';
  const dbConnectionString = 'postgresql://postgres.hwxfrbxpbvpsuzdhlbtn:[YOUR-PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres';

  const fetchStats = () => {
    setLoading(true);
    fetch(`${backendUrl}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handlePurgeDatabase = async () => {
    setPurging(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/purge-database`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setPurgeSuccess(true);
        setShowPurgeModal(false);
        fetchStats();
        setTimeout(() => setPurgeSuccess(false), 4000);
      }
    } catch (err) {
      console.warn('Purge error:', err);
    } finally {
      setPurging(false);
    }
  };

  const handleCopyDb = () => {
    navigator.clipboard.writeText(dbConnectionString);
    setCopiedDbString(true);
    setTimeout(() => setCopiedDbString(false), 3000);
  };

  // 12 Distinct Section Management Boxes
  const sectionBoxes = [
    {
      id: 'profile',
      boxNumber: 'BOX 01',
      title: 'Profile & Hero Identity',
      description: 'Your name, title, bio, location, tagline, and profile photos.',
      count: stats?.profile?.name ? 'Configured' : 'Needs Input',
      badge: 'Core Identity',
      badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
      icon: <User className="w-5 h-5 text-cyan-400" />,
      link: '/admin/profile',
      dbTable: 'public.profiles'
    },
    {
      id: 'education-school',
      boxNumber: 'BOX 02',
      title: 'School Education',
      description: 'Secondary School Certificate (SSC), 10th grade marks, school name.',
      count: `${stats?.educationCount || 0} Records`,
      badge: 'Academic',
      badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
      link: '/admin/education',
      dbTable: 'public.education'
    },
    {
      id: 'education-inter',
      boxNumber: 'BOX 03',
      title: 'Intermediate (+2) Education',
      description: 'Junior college, MPC / stream, state board credentials and memos.',
      count: 'Category Filter',
      badge: 'Higher Secondary',
      badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      icon: <GraduationCap className="w-5 h-5 text-emerald-400" />,
      link: '/admin/education',
      dbTable: 'public.education'
    },
    {
      id: 'education-degree',
      boxNumber: 'BOX 04',
      title: 'B.Tech / Degree Education',
      description: 'Engineering university, branch, semesters, CGPA, and coursework.',
      count: stats?.profile?.college ? stats.profile.college : 'Set College',
      badge: 'Undergraduate',
      badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      icon: <Layers className="w-5 h-5 text-emerald-400" />,
      link: '/admin/education',
      dbTable: 'public.education'
    },
    {
      id: 'skills',
      boxNumber: 'BOX 05',
      title: 'Skills & Technical Stack',
      description: 'Frontend, Backend, Databases, Cloud tools, and proficiencies.',
      count: `${stats?.totalSkills || 0} Skills`,
      badge: 'Technical',
      badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
      icon: <Wrench className="w-5 h-5 text-indigo-400" />,
      link: '/admin/skills',
      dbTable: 'public.skills'
    },
    {
      id: 'projects',
      boxNumber: 'BOX 06',
      title: 'Projects & Case Studies',
      description: 'Interactive 3D showcases, GitHub repos, live deployments, videos.',
      count: `${stats?.publishedProjects || 0} Published`,
      badge: 'Showcase',
      badgeColor: 'border-violet-500/30 text-violet-400 bg-violet-500/10',
      icon: <FolderGit2 className="w-5 h-5 text-violet-400" />,
      link: '/admin/projects',
      dbTable: 'public.projects'
    },
    {
      id: 'documents',
      boxNumber: 'BOX 07',
      title: 'Document & File Storage',
      description: 'Mark sheets, certificates, PDFs with PUBLIC/PRIVATE access controls.',
      count: `${stats?.totalDocuments || 0} Files (${stats?.publicDocuments || 0} Public)`,
      badge: 'Storage',
      badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      link: '/admin/documents',
      dbTable: 'public.portfolio_documents'
    },
    {
      id: 'certifications',
      boxNumber: 'BOX 08',
      title: 'Certifications & Badges',
      description: 'Professional course certifications, verification badges & credentials.',
      count: `${stats?.certificationsCount || 0} Verified`,
      badge: 'Credentials',
      badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
      icon: <Award className="w-5 h-5 text-purple-400" />,
      link: '/admin/certifications',
      dbTable: 'public.certifications'
    },
    {
      id: 'achievements',
      boxNumber: 'BOX 09',
      title: 'Achievements & Awards',
      description: 'Hackathon wins, honors, coding platform ratings, recognitions.',
      count: `${stats?.achievementsCount || 0} Honors`,
      badge: 'Awards',
      badgeColor: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10',
      icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      link: '/admin/achievements',
      dbTable: 'public.achievements'
    },
    {
      id: 'experience',
      boxNumber: 'BOX 10',
      title: 'Experience & Internships',
      description: 'Software roles, responsibilities, engineering internships, tenure.',
      count: 'Timeline Ready',
      badge: 'Career',
      badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
      icon: <Briefcase className="w-5 h-5 text-blue-400" />,
      link: '/admin/experience',
      dbTable: 'public.experiences'
    },
    {
      id: 'socials',
      boxNumber: 'BOX 11',
      title: 'Social Presence & Links',
      description: 'GitHub, LinkedIn, Twitter/X, LeetCode, email, and handles.',
      count: 'Live Sync',
      badge: 'Channels',
      badgeColor: 'border-sky-500/30 text-sky-400 bg-sky-500/10',
      icon: <Share2 className="w-5 h-5 text-sky-400" />,
      link: '/admin/socials',
      dbTable: 'public.social_links'
    },
    {
      id: 'settings',
      boxNumber: 'BOX 12',
      title: 'Website Settings & 3D Controls',
      description: 'Section visibility toggles, 3D Canvas toggles, SEO metadata.',
      count: 'Configured',
      badge: 'System',
      badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
      icon: <Settings className="w-5 h-5 text-rose-400" />,
      link: '/admin/website-settings',
      dbTable: 'public.website_settings'
    }
  ];

  // Database Tables Definition
  const databaseTables = [
    { name: 'profiles', records: '1 (Single Source)', rls: 'Public Read', desc: 'Hero headlines, titles, developer bio, email' },
    { name: 'education', records: `${stats?.educationCount || 0}`, rls: 'Public Read', desc: 'Schools, intermediate, engineering colleges' },
    { name: 'skills', records: `${stats?.totalSkills || 0}`, rls: 'Public Read', desc: 'Technical proficiencies grouped by domain' },
    { name: 'projects', records: `${stats?.totalProjects || 0}`, rls: 'Public Read', desc: 'Project showcase, GitHub & live links' },
    { name: 'portfolio_documents', records: `${stats?.totalDocuments || 0}`, rls: 'Strict RLS', desc: 'Mark sheets, certificates, private/public files' },
    { name: 'document_versions', records: 'Versioned', rls: 'Admin Only', desc: 'Immutable version history and rollback logs' },
    { name: 'certifications', records: `${stats?.certificationsCount || 0}`, rls: 'Public Read', desc: 'Official credentials with verification URLs' },
    { name: 'achievements', records: `${stats?.achievementsCount || 0}`, rls: 'Public Read', desc: 'Competitions, honors, and recognitions' },
    { name: 'experiences', records: '0', rls: 'Public Read', desc: 'Work history, internships, roles' },
    { name: 'social_links', records: 'Configured', rls: 'Public Read', desc: 'External profile links and social handles' },
    { name: 'website_settings', records: '1', rls: 'Public Read', desc: 'Site metadata, section visibility toggles' },
    { name: 'admin_users', records: '1 (Super Admin)', rls: 'Admin Only', desc: 'nagaseshukumarbobbiti@gmail.com' },
    { name: 'admin_audit_logs', records: 'Active', rls: 'Admin Only', desc: 'Timestamped administrative actions' }
  ];

  return (
    <div className="space-y-8">
      
      {/* 3D Telemetry & Core Engine Hero Banner */}
      <Admin3DHeroWidget />

      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#111422]/90 to-[#151928]/90 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-3 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Super Administrator Session Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, {stats?.profile?.name || 'Nagaseshu Kumar'}.
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Each section of your portfolio is cleanly organized into independent modular boxes below. Changes reflect on your live website in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/profile"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shrink-0 shadow-md shadow-indigo-600/30"
            style={{ backgroundColor: theme.primary }}
          >
            <User className="w-4 h-4" />
            Edit Profile
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            View Live Site
          </a>
          <button
            onClick={() => setShowPurgeModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-medium flex items-center gap-2 transition-colors shrink-0"
            title="Clean purge of previous data"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Purge Old Data</span>
          </button>
        </div>
      </div>

      {/* Purge Success Banner */}
      {purgeSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Database successfully purged! All previous test content removed. Ready for your pristine records.</span>
        </div>
      )}

      {/* Confirmation Modal for Purge */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121524] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Purge Previous Database Contents?</h3>
                <p className="text-xs text-slate-400">Clean slate re-initialization</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will remove all previous dummy/test projects, unverified skills, and placeholder education records from the store, leaving a 100% clean database state with zero fake data.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowPurgeModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePurgeDatabase}
                disabled={purging}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-rose-600/30"
              >
                {purging ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>{purging ? 'Purging...' : 'Confirm Purge'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 📦 SEPARATE SECTION BOXES FOR EACH PORTFOLIO SECTION    */}
      {/* ======================================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Portfolio Section Management Hub
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any section box to manage, update, or view its dedicated data table.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
            12 Modular Boxes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sectionBoxes.map((box) => (
            <div
              key={box.id}
              className="p-5 rounded-2xl bg-[#0c0f1a]/85 backdrop-blur-xl border border-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {box.boxNumber}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${box.badgeColor}`}>
                      {box.badge}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-white group-hover:scale-105 transition-all">
                    {box.icon}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                  {box.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                  {box.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">Status / Data:</span>
                  <span className="text-slate-200 font-semibold font-mono text-xs">{box.count}</span>
                </div>

                <Link
                  to={box.link}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500 transition-all flex items-center gap-1.5 font-medium text-[11px]"
                >
                  <span>Manage Table</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🗄️ SUPABASE POSTGRESQL DATABASE & TABLES OVERVIEW BOX    */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-[#0e111a] border border-slate-800 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Supabase PostgreSQL Connection & Schema
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Target database: <span className="font-mono text-indigo-300">db.hwxfrbxpbvpsuzdhlbtn.supabase.co:5432</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyDb}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            {copiedDbString ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedDbString ? 'Copied Connection String!' : 'Copy Connection String'}</span>
          </button>
        </div>

        {/* Connection String Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 break-all select-all flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Server className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>postgresql://postgres:[YOUR-PASSWORD]@db.hwxfrbxpbvpsuzdhlbtn.supabase.co:5432/postgres</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 shrink-0 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20">
            SSL Mode: Enabled
          </span>
        </div>

        {/* Database Tables Summary Table */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
            Database Tables Architecture (13 Verified Tables)
          </h3>
          
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Table Name</th>
                  <th className="py-3 px-4">Records Status</th>
                  <th className="py-3 px-4">Row-Level Security (RLS)</th>
                  <th className="py-3 px-4">Section / Purpose</th>
                  <th className="py-3 px-4 text-right">SQL Schema</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {databaseTables.map((tbl, i) => (
                  <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-indigo-300 flex items-center gap-1.5">
                      <span className="text-slate-600">public.</span>{tbl.name}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300">{tbl.records}</td>
                    <td className="py-2.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${
                        tbl.rls === 'Strict RLS' 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : tbl.rls === 'Admin Only' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {tbl.rls}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 font-sans">{tbl.desc}</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="text-[10px] text-cyan-400 font-mono">database/sections/</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};