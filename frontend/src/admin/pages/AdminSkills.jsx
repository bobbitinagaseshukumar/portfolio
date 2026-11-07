import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Wrench, CheckCircle2, Save, X, RefreshCw } from 'lucide-react';

export const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const categories = [
    '3D & Creative Development',
    'Frontend',
    'Backend',
    'Database',
    'Programming',
    'AI / Technology',
    'Tools',
    'Cloud & Deployment'
  ];

  const fetchSkills = () => {
    fetch(`${backendUrl}/api/admin/skills`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSkills(data.data);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleOpenAdd = () => {
    setEditingSkill({
      name: '',
      category: 'Frontend',
      proficiency: 85,
      isFeatured: false,
      learningStatus: 'mastered',
      isPublished: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingSkill({ ...skill });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    const isNew = !editingSkill.id || editingSkill.id.startsWith('temp-');
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew
      ? `${backendUrl}/api/admin/skills`
      : `${backendUrl}/api/admin/skills/${editingSkill.id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(editingSkill)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchSkills();
        setNotification('Skill saved.');
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/admin/skills/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchSkills();
        setNotification('Skill deleted.');
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Skills Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Add and curate your programming languages, 3D libraries, cloud frameworks, and tools.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Skills Grid */}
      {loading ? (
        <div className="p-8 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
          Loading skills...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 rounded-2xl bg-[#0f121d] border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-800/40">
                    {skill.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(skill)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-sm font-bold text-white">{skill.name}</h3>
                  <span className="text-xs font-mono text-indigo-400 font-semibold">{skill.proficiency}%</span>
                </div>

                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>Status: <strong className="text-slate-300 capitalize">{skill.learningStatus || 'mastered'}</strong></span>
                {skill.isFeatured && <span className="text-amber-400">★ Featured</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#111420] border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">
                {editingSkill.id ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g. Three.js, React, Python"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Category</label>
                <select
                  value={editingSkill.category}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1 font-medium">
                  <span>Proficiency Level</span>
                  <span className="font-mono text-cyan-400">{editingSkill.proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={editingSkill.proficiency}
                  onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value, 10) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Learning Status</label>
                  <select
                    value={editingSkill.learningStatus}
                    onChange={(e) => setEditingSkill({ ...editingSkill, learningStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="mastered">Mastered</option>
                    <option value="in-progress">In Progress</option>
                    <option value="learning">Learning</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={editingSkill.isFeatured || false}
                    onChange={(e) => setEditingSkill({ ...editingSkill, isFeatured: e.target.checked })}
                    className="rounded border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <label htmlFor="isFeatured" className="text-slate-300">Featured Skill</label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
