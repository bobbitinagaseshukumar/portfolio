import React, { useState, useEffect } from 'react';
import { Share2, Plus, Trash2, Save, CheckCircle2 } from 'lucide-react';

export const AdminSocials = () => {
  const [socials, setSocials] = useState([]);
  const [notification, setNotification] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/social-links`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then(res => res.json())
      .then(d => { if (d.success) setSocials(d.data); })
      .catch(() => {});
  }, []);

  const handleToggle = (id) => {
    setSocials(socials.map(s => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s));
  };

  const handleSave = async () => {
    try {
      await fetch(`${backendUrl}/api/admin/social-links`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(socials)
      });
      setNotification('Social links saved.');
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Social Links</h1>
          <p className="text-xs text-slate-400 mt-1">Manage public social networks and profiles.</p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
        >
          Save Links
        </button>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-300 text-xs">
          {notification}
        </div>
      )}

      <div className="space-y-3">
        {socials.map((s) => (
          <div key={s.id} className="p-4 rounded-xl bg-[#0f121d] border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white">{s.platform}</span>
              <div className="text-slate-400 font-mono text-[11px]">{s.url}</div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={s.isEnabled}
                onChange={() => handleToggle(s.id)}
                className="rounded border-slate-800 text-indigo-600"
              />
              <span className="text-slate-300 text-xs">{s.isEnabled ? 'Active' : 'Disabled'}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
