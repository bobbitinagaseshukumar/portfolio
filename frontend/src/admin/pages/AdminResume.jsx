import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle2, UploadCloud, Eye, Download, RefreshCw } from 'lucide-react';

export const AdminResume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://portfolio-zsk2.onrender.com';

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/resume`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setResume(data.data);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/resume`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(resume)
      });
      const data = await res.json();
      if (data.success) {
        setNotification('Resume settings updated. Click "Publish Changes" to reflect on the public site.');
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !resume) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
        Loading resume details...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Resume Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Update your active resume PDF, download permissions, and version notes.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shadow-md shadow-indigo-600/30"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0f121d] border border-slate-800 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Resume Title</label>
            <input
              type="text"
              value={resume.title || ''}
              onChange={(e) => setResume({ ...resume, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Resume File Path / URL (PDF)</label>
            <input
              type="text"
              value={resume.fileUrl || ''}
              onChange={(e) => setResume({ ...resume, fileUrl: e.target.value })}
              placeholder="/resume.pdf or Supabase Storage URL"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Drop your PDF in <code className="text-slate-400 font-mono">frontend/public/resume.pdf</code> or link to Supabase Storage.
            </p>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">File Display Name</label>
            <input
              type="text"
              value={resume.fileName || ''}
              onChange={(e) => setResume({ ...resume, fileName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-6 pt-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={resume.downloadEnabled || false}
                onChange={(e) => setResume({ ...resume, downloadEnabled: e.target.checked })}
                className="rounded border-slate-800 text-indigo-600 focus:ring-0"
              />
              <span className="text-slate-300 font-medium">Enable Public Download Button</span>
            </label>
          </div>
        </div>

        {/* Preview Card */}
        <div className="p-6 rounded-2xl bg-[#0f121d] border border-slate-800 flex flex-col justify-between text-xs">
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Active Public Version</h3>
            <p className="text-slate-400 text-[11px] mb-3">
              Last updated: {resume.lastUpdatedDate || 'Recent'}
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 truncate">
              {resume.fileName || 'resume.pdf'}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex gap-2">
            <a
              href={resume.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-center text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview PDF
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};
