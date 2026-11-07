import React, { useState, useEffect } from 'react';
import { Sliders, Save, CheckCircle2, RefreshCw, Sparkles, ShieldAlert } from 'lucide-react';

export const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Website & 3D Hero Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure global website parameters, SEO metadata, and 3D WebGL experience settings.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shadow-md shadow-indigo-600/30"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Settings</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        
        {/* 3D WebGL Experience Card */}
        <div className="p-6 rounded-2xl bg-[#0f121d] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">3D Hero Experience Settings</h3>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
            <div>
              <span className="text-slate-300 font-medium block">Interactive 3D WebGL Canvas</span>
              <span className="text-[11px] text-slate-500">Enable real-time 3D particle universe & cyber core</span>
            </div>
            <input
              type="checkbox"
              checked={settings.hero3dEnabled ?? true}
              onChange={(e) => setSettings({ ...settings, hero3dEnabled: e.target.checked })}
              className="rounded border-slate-800 text-indigo-600 focus:ring-0"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Hero Reveal Display Name</label>
            <input
              type="text"
              value={settings.heroRevealText || 'Kumar'}
              onChange={(e) => setSettings({ ...settings, heroRevealText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Developer Title Reveal Text</label>
            <input
              type="text"
              value={settings.developerTitleReveal || 'Full-Stack Developer & 3D Web Creative'}
              onChange={(e) => setSettings({ ...settings, developerTitleReveal: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Loading Screen Status Message</label>
            <input
              type="text"
              value={settings.loadingScreenText || 'Initializing 3D WebGL Space...'}
              onChange={(e) => setSettings({ ...settings, loadingScreenText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Global Website & SEO Card */}
        <div className="p-6 rounded-2xl bg-[#0f121d] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">General & SEO Information</h3>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Website Name</label>
            <input
              type="text"
              value={settings.siteName || ''}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">SEO Page Title</label>
            <input
              type="text"
              value={settings.seoTitle || ''}
              onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Website Description / Meta</label>
            <textarea
              rows={3}
              value={settings.siteDescription || ''}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Footer Copyright Text</label>
            <input
              type="text"
              value={settings.copyrightText || ''}
              onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

      </form>
    </div>
  );
};
