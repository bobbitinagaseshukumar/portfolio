import React, { useState, useEffect } from 'react';
import {
  Share2,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  ExternalLink,
  Globe,
  Edit2,
  X
} from 'lucide-react';
import { useAdminTheme } from '../context/AdminThemeContext';

export const AdminSocials = () => {
  const { theme } = useAdminTheme();
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    platform: 'GitHub',
    handle: '',
    url: '',
    isEnabled: true
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://portfolio-zsk2.onrender.com';

  const showNotice = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchSocials = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/social-links`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) setSocials(data.data || []);
    } catch (err) {
      console.warn('Failed to fetch socials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      platform: 'GitHub',
      handle: '',
      url: '',
      isEnabled: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setForm({
      platform: item.platform || 'GitHub',
      handle: item.handle || '',
      url: item.url || '',
      isEnabled: Boolean(item.isEnabled)
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.url) {
      showNotice('URL is required.', 'error');
      return;
    }

    try {
      const url = editingId
        ? `${backendUrl}/api/admin/social-links/${editingId}`
        : `${backendUrl}/api/admin/social-links`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        showNotice(editingId ? 'Social link updated.' : 'Social link added.');
        setIsModalOpen(false);
        fetchSocials();
      } else {
        showNotice(data.error || 'Failed to save social link.', 'error');
      }
    } catch (err) {
      showNotice(err.message, 'error');
    }
  };

  const handleToggle = async (item) => {
    try {
      const updated = { ...item, isEnabled: !item.isEnabled };
      const res = await fetch(`${backendUrl}/api/admin/social-links/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setSocials(socials.map(s => s.id === item.id ? updated : s));
      }
    } catch (err) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this social link?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/admin/social-links/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotice('Social link removed.');
        fetchSocials();
      }
    } catch (err) {
      showNotice(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono mb-2">
            <Share2 className="w-3.5 h-3.5" />
            BOX 11 • Public Outlets
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Social Profiles & Handles
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure your GitHub, LinkedIn, Twitter/X, LeetCode, and developer portfolio presence.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl text-white text-xs font-semibold flex items-center gap-2 transition-transform hover:scale-105 shadow-md shadow-indigo-600/30"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, #3730a3)` }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Social Channel</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-xl text-xs font-mono flex items-center gap-2 border animate-in fade-in ${
          notification.type === 'error'
            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Empty State */}
      {socials.length === 0 && !loading && (
        <div className="p-12 rounded-3xl bg-[#0c0f1a]/80 backdrop-blur-xl border border-slate-800/80 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Social Profiles Added</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Add your real GitHub, LinkedIn, and personal coding profiles so visitors can connect.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700"
          >
            + Add First Profile
          </button>
        </div>
      )}

      {/* Social Links List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {socials.map((s) => (
          <div
            key={s.id}
            className={`p-5 rounded-2xl bg-[#0c0f1a]/85 backdrop-blur-xl border transition-all flex items-center justify-between shadow-sm ${
              s.isEnabled ? 'border-slate-800 hover:border-sky-500/40' : 'border-slate-800/40 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0">
                {s.platform?.substring(0, 2).toUpperCase() || 'SO'}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{s.platform}</h3>
                  <button
                    onClick={() => handleToggle(s)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      s.isEnabled
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {s.isEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                {s.handle && (
                  <div className="text-[11px] text-slate-400 font-mono">@{s.handle}</div>
                )}
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 truncate block mt-0.5"
                >
                  {s.url}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <button
                onClick={() => openEditModal(s)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#111422] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-sky-400" />
                {editingId ? 'Edit Social Profile' : 'Add Social Profile'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Platform *</label>
                <select
                  value={form.platform}
                  onChange={e => setForm({ ...form, platform: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="GitHub">GitHub</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter / X">Twitter / X</option>
                  <option value="LeetCode">LeetCode</option>
                  <option value="Codeforces">Codeforces</option>
                  <option value="CodeChef">CodeChef</option>
                  <option value="Kaggle">Kaggle</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Medium">Medium</option>
                  <option value="Discord">Discord</option>
                  <option value="Custom Portfolio">Custom Website</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Username / Handle</label>
                <input
                  type="text"
                  value={form.handle}
                  onChange={e => setForm({ ...form, handle: e.target.value })}
                  placeholder="e.g. nagaseshukumar"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Profile URL *</label>
                <input
                  type="url"
                  required
                  value={form.url}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                  placeholder="https://github.com/bobbitinagaseshukumar"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isEnabledSocial"
                  checked={form.isEnabled}
                  onChange={e => setForm({ ...form, isEnabled: e.target.checked })}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="isEnabledSocial" className="text-slate-300 cursor-pointer">
                  Display this link on live public portfolio navbar and footer
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
                  style={{ backgroundColor: theme.primary }}
                >
                  {editingId ? 'Save Changes' : 'Create Channel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
