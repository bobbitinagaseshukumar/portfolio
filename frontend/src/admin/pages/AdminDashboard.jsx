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
  CheckCircle2
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminDashboard = () => {
  const { adminUser } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: 'Projects',
      value: stats ? `${stats.publishedProjects} / ${stats.totalProjects}` : '2 / 2',
      sub: 'Published / Total',
      icon: <FolderGit2 className="w-5 h-5 text-indigo-400" />,
      link: '/admin/projects'
    },
    {
      label: 'Technical Skills',
      value: stats ? stats.totalSkills : '8',
      sub: 'Categorized',
      icon: <Wrench className="w-5 h-5 text-cyan-400" />,
      link: '/admin/skills'
    },
    {
      label: 'Education Records',
      value: stats ? stats.educationCount : '2',
      sub: 'College & School',
      icon: <GraduationCap className="w-5 h-5 text-emerald-400" />,
      link: '/admin/education'
    },
    {
      label: 'Certifications',
      value: stats ? stats.certificationsCount : '1',
      sub: 'Verified Credentials',
      icon: <Award className="w-5 h-5 text-purple-400" />,
      link: '/admin/certifications'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#111422] to-[#151928] border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-2 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Authenticated Administrator Session
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, {stats?.profile?.name || 'Kumar'}.
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Manage your entire 3D portfolio website without modifying source code. Edits are saved in real-time and published to your public website.
          </p>
        </div>

        <Link
          to="/admin/profile"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shrink-0 shadow-md shadow-indigo-600/30"
        >
          <User className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className="p-5 rounded-2xl bg-[#0f121d] border border-slate-800 hover:border-indigo-500/40 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-slate-400">{card.label}</span>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-105 transition-transform">
                {card.icon}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-0.5">{card.value}</div>
              <div className="text-[11px] text-slate-500 font-mono">{card.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Academic & College Snapshot */}
        <div className="p-6 rounded-2xl bg-[#0f121d] border border-slate-800">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Active College & Degree Details
            </h3>
            <Link to="/admin/education" className="text-xs text-indigo-400 hover:text-indigo-300">
              Manage
            </Link>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Current College:</span>
              <span className="text-white font-medium">{stats?.profile?.college || 'Institute of Technology'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Developer Title:</span>
              <span className="text-cyan-400 font-medium">{stats?.profile?.title || 'Full-Stack Developer & 3D Web Creative'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Content Synchronization:</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> Supabase Live
              </span>
            </div>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="p-6 rounded-2xl bg-[#0f121d] border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Quick Management Links
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Link
              to="/admin/projects"
              className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-300 hover:text-white transition-colors"
            >
              <span>Add Project</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
            <Link
              to="/admin/skills"
              className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-300 hover:text-white transition-colors"
            >
              <span>Manage Skills</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
            <Link
              to="/admin/resume"
              className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-300 hover:text-white transition-colors"
            >
              <span>Update Resume</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
            <Link
              to="/admin/website-settings"
              className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-300 hover:text-white transition-colors"
            >
              <span>3D Hero Settings</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
