import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Save,
  X,
  ExternalLink,
  Table,
  LayoutGrid,
  Award,
  Sparkles
} from 'lucide-react';
import { useAdminTheme } from '../context/AdminThemeContext';

export const AdminAchievements = () => {
  const { theme } = useAdminTheme();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({
    title: '',
    issuer: '',
    date: '',
    description: '',
    proofUrl: '',
    verificationUrl: '',
    isFeatured: false
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://portfolio-zsk2.onrender.com';

  const showNotice = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/achievements`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) setAchievements(data.data || []);
    } catch (err) {
      console.warn('Failed to fetch achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      title: '',
      issuer: '',
      date: '',
      description: '',
      proofUrl: '',
      verificationUrl: '',
      isFeatured: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      issuer: item.issuer || '',
      date: item.date || '',
      description: item.description || '',
      proofUrl: item.proofUrl || '',
      verificationUrl: item.verificationUrl || '',
      isFeatured: Boolean(item.isFeatured)
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.issuer) {
      showNotice('Title and Issuer are required.', 'error');
      return;
    }

    try {
      const url = editingId
        ? `${backendUrl}/api/admin/achievements/${editingId}`
        : `${backendUrl}/api/admin/achievements`;
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
        showNotice(editingId ? 'Achievement updated.' : 'Achievement added.');
        setIsModalOpen(false);
        fetchAchievements();
      } else {
        showNotice(data.error || 'Failed to save achievement.', 'error');
      }
    } catch (err) {
      showNotice(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this achievement?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/admin/achievements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotice('Achievement deleted.');
        fetchAchievements();
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
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-mono mb-2">
            <Trophy className="w-3.5 h-3.5" />
            BOX 09 • Honors & Competitions
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Achievements & Recognitions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Display hackathon rankings, coding platform honors, and academic awards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl text-white text-xs font-semibold flex items-center gap-2 transition-transform hover:scale-105 shadow-md shadow-indigo-600/30"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, #3730a3)` }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Achievement</span>
          </button>
        </div>
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
      {achievements.length === 0 && !loading && (
        <div className="p-12 rounded-3xl bg-[#0c0f1a]/80 backdrop-blur-xl border border-slate-800/80 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center mx-auto">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Achievements Recorded Yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Your database has zero fake awards. Click "Add Achievement" to store your real contest victories and honors.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700"
          >
            + Add First Achievement
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && achievements.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#0c0f1a]/85 backdrop-blur-xl border border-slate-800/80 hover:border-yellow-500/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-yellow-300 transition-colors">
                        {item.title}
                      </h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {item.issuer} • <span className="font-mono text-[11px] text-indigo-400">{item.date}</span>
                      </div>
                    </div>
                  </div>
                  {item.isFeatured && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shrink-0 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {(item.verificationUrl || item.proofUrl) && (
                  <div className="mt-3 flex items-center gap-3">
                    {item.verificationUrl && (
                      <a
                        href={item.verificationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-800/60">
                <button
                  onClick={() => openEditModal(item)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && achievements.length > 0 && (
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#0c0f1a]/85 backdrop-blur-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101424] text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Issuer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {achievements.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{item.title}</td>
                  <td className="py-3 px-4 text-indigo-400">{item.issuer}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{item.date}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(item)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
                        <Edit2 className="w-3.5 h-3.5 text-yellow-400" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111422] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                {editingId ? 'Edit Achievement' : 'Add Achievement'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Honor / Achievement Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 1st Place National Hackathon, Smart India Hackathon"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Organizing Body / Issuer *</label>
                  <input
                    type="text"
                    required
                    value={form.issuer}
                    onChange={e => setForm({ ...form, issuer: e.target.value })}
                    placeholder="e.g. ACM / IEEE / Government"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Date</label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    placeholder="e.g. Nov 2025"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Verification / Certificate URL</label>
                <input
                  type="url"
                  value={form.verificationUrl}
                  onChange={e => setForm({ ...form, verificationUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Summary / Accomplishment Details</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Details regarding the contest, team size, solution built..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeaturedAch"
                  checked={form.isFeatured}
                  onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="isFeaturedAch" className="text-slate-300 cursor-pointer">
                  Feature prominently on portfolio home section
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
                  {editingId ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
