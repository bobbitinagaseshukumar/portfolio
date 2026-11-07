import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Save,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  Palette,
  Box,
  Trash2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useAdminTheme } from '../context/AdminThemeContext';

export const AdminSettings = () => {
  const { theme, themeId, setThemeId, themes, threeDEnabled, toggle3D } = useAdminTheme();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // Purge modal state
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purging, setPurging] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://portfolio-zsk2.onrender.com';

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/settings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSettings(data.data);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setNotification('Settings saved. Click "Publish Changes" to push live.');
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

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
        setShowPurgeModal(false);
        setNotification('🧹 All previous contents purged. Database is now in a clean state.');
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      console.warn('Purge error:', err);
    } finally {
      setPurging(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono mb-2">
            <Sliders className="w-3.5 h-3.5" />
            BOX 12 • Global Controls
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Website, 3D Canvas & Admin OS Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure themes, 3D WebGL scenes, SEO metadata, and clean database wipes.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-transform hover:scale-105 shadow-md shadow-indigo-600/30"
          style={{ backgroundColor: theme.primary }}
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Panel Theme & 3D Customizer Card */}
      <div className="p-6 rounded-3xl bg-[#0c0f1a]/85 backdrop-blur-xl border border-slate-800/80 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Palette className="w-4 h-4 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Admin OS Theme & 3D Experience</h3>
              <p className="text-xs text-slate-400">Choose the executive accent and toggle 3D ambient scenes.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle3D}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                threeDEnabled
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{threeDEnabled ? 'Admin 3D: Enabled' : 'Admin 3D: Eco Mode'}</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Admin Color Palette Accent</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.values(themes).map(t => (
              <button
                type="button"
                key={t.id}
                onClick={() => setThemeId(t.id)}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  themeId === t.id
                    ? 'bg-slate-800/80 border-indigo-500 shadow-md shadow-indigo-500/10 text-white'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="w-4 h-4 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: t.primary }} />
                <span className="text-xs font-medium truncate">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Public 3D Portfolio Hero Settings */}
        <div className="p-6 rounded-3xl bg-[#0c0f1a]/85 backdrop-blur-xl border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Public 3D Cinematic Portfolio Controls</h3>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div>
              <div className="font-semibold text-white">Enable Three.js Interactive WebGL Background</div>
              <div className="text-[11px] text-slate-400">Renders the dynamic particle starfield and 3D geometric shapes on public pages.</div>
            </div>
            <input
              type="checkbox"
              checked={settings.hero3dEnabled}
              onChange={(e) => setSettings({ ...settings, hero3dEnabled: e.target.checked })}
              className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-0"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Hero Primary Name Display</label>
            <input
              type="text"
              value={settings.heroRevealText || 'Nagaseshu Kumar'}
              onChange={(e) => setSettings({ ...settings, heroRevealText: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Headline Developer Subtitle</label>
            <input
              type="text"
              value={settings.developerTitleReveal || ''}
              onChange={(e) => setSettings({ ...settings, developerTitleReveal: e.target.value })}
              placeholder="e.g. Full-Stack Software Engineer & Creative Technologist"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Preloader Screen Status Message</label>
            <input
              type="text"
              value={settings.loadingScreenText || 'Initializing 3D Space...'}
              onChange={(e) => setSettings({ ...settings, loadingScreenText: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Global Website & SEO Card */}
        <div className="p-6 rounded-3xl bg-[#0c0f1a]/85 backdrop-blur-xl border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">General & SEO Information</h3>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Website Site Title</label>
            <input
              type="text"
              value={settings.siteName || ''}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">SEO Browser Tab Title</label>
            <input
              type="text"
              value={settings.seoTitle || ''}
              onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Search Engine Meta Description</label>
            <textarea
              rows={3}
              value={settings.siteDescription || ''}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Footer Copyright Text</label>
            <input
              type="text"
              value={settings.copyrightText || ''}
              onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Database Clean Wipe & Purge Card */}
        <div className="p-6 rounded-3xl bg-[#0c0f1a]/85 backdrop-blur-xl border border-rose-500/20 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-rose-500/20">
            <Trash2 className="w-4 h-4 text-rose-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Purge Previous Database Contents</h3>
              <p className="text-[11px] text-slate-400">Remove old test data and leave a pristine zero-fake-data state.</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            If you want to clear out any leftover test items and ensure that only your real records are stored in the database, you can execute a clean database purge here.
          </p>

          <button
            type="button"
            onClick={() => setShowPurgeModal(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Purge All Previous Contents</span>
          </button>
        </div>

      </form>

      {/* Confirmation Modal for Purge */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121524] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Purge All Previous Contents?</h3>
                <p className="text-xs text-slate-400">Clean database slate reset</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will remove all previous placeholder projects, skills, education, and achievements, keeping your identity as Nagaseshu Kumar Bobbiti and preparing a clean database for your real content.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPurgeModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
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
    </div>
  );
};
