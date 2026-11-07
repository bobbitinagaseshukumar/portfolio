import React, { useState } from 'react';
import {
  Image,
  UploadCloud,
  Film,
  FileText,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminTheme } from '../context/AdminThemeContext';

export const AdminMedia = () => {
  const { theme } = useAdminTheme();
  const [copiedPath, setCopiedPath] = useState(false);

  const videoDir = 'frontend/public/videos/';

  const handleCopy = () => {
    navigator.clipboard.writeText(videoDir);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono mb-2">
            <Film className="w-3.5 h-3.5" />
            Media & Asset Vault
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Media, Videos & Asset Library
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage high-definition project showcase videos, certificate previews, and profile assets.
          </p>
        </div>

        <Link
          to="/admin/documents"
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Open Document Vault</span>
        </Link>
      </div>

      {/* Main Video Callout Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0f1a]/85 backdrop-blur-xl border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex items-center gap-3 text-indigo-400 font-bold text-base pb-3 border-b border-slate-800/60">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white">Project Showcase Video Directory</h3>
            <p className="text-xs text-slate-400 font-normal">Direct local and streamed video embedding engine</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Your portfolio is wired with responsive cinematic video modals. Simply place your recorded video demos (MP4, WebM, MOV) into the project's public video directory:
        </p>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300">
          <span>{videoDir}</span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors text-[11px]"
          >
            {copiedPath ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPath ? 'Copied' : 'Copy Path'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Responsive 16:9 Player</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>YouTube & Loom Support</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Hardware Accelerated</span>
          </div>
        </div>
      </div>

      {/* Integration Card */}
      <div className="p-6 rounded-3xl bg-[#0c0f1a]/85 backdrop-blur-xl border border-slate-800/80 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            Certificates, Marksheets & Official Documents
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Upload PDFs, marksheets, and credential proofs to the secure document vault with Public/Private access controls.
          </p>
        </div>
        <Link
          to="/admin/documents"
          className="px-4 py-2 rounded-xl text-white text-xs font-semibold shrink-0 shadow-md shadow-indigo-600/30"
          style={{ backgroundColor: theme.primary }}
        >
          Manage Documents
        </Link>
      </div>

    </div>
  );
};
