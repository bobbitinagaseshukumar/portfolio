import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Save,
  X,
  Calendar,
  MapPin,
  Building2,
  ExternalLink,
  Table,
  LayoutGrid
} from 'lucide-react';
import { useAdminTheme } from '../context/AdminThemeContext';

export const AdminExperience = () => {
  const { theme } = useAdminTheme();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({
    company: '',
    role: '',
    employmentType: 'Full-time',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    technologies: '',
    companyUrl: ''
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://portfolio-zsk2.onrender.com';

  const showNotice = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/experiences`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) setExperiences(data.data || []);
    } catch (err) {
      console.warn('Failed to fetch experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      company: '',
      role: '',
      employmentType: 'Full-time',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      technologies: '',
      companyUrl: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingId(exp.id);
    setForm({
      company: exp.company || exp.organization || '',
      role: exp.role || exp.title || '',
      employmentType: exp.employmentType || 'Full-time',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      isCurrent: Boolean(exp.isCurrent),
      description: exp.description || '',
      technologies: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : (exp.technologies || ''),
      companyUrl: exp.companyUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) {
      showNotice('Company name and role are required.', 'error');
      return;
    }

    const payload = {
      ...form,
      technologies: form.technologies ? form.technologies.split(',').map(t => t.trim()) : []
    };

    try {
      const url = editingId
        ? `${backendUrl}/api/admin/experiences/${editingId}`
        : `${backendUrl}/api/admin/experiences`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showNotice(editingId ? 'Experience updated.' : 'Experience added.');
        setIsModalOpen(false);
        fetchExperiences();
      } else {
        showNotice(data.error || 'Failed to save experience.', 'error');
      }
    } catch (err) {
      showNotice(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience record?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/admin/experiences/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotice('Experience record deleted.');
        fetchExperiences();
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
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            BOX 10 • Career & Journey
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Work Experience & Internships
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain your engineering roles, software internships, and career milestones. Zero fake data.
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
            <span>Add Experience</span>
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
      {experiences.length === 0 && !loading && (
        <div className="p-12 rounded-3xl bg-[#0c0f1a]/80 backdrop-blur-xl border border-slate-800/80 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Experience Records Stored</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Your database has zero fake jobs. Click "Add Experience" to add your real engineering internships, roles, and milestones.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700"
          >
            + Add First Experience Record
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && experiences.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-5 rounded-2xl bg-[#0c0f1a]/85 backdrop-blur-xl border border-slate-800/80 hover:border-blue-500/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                      {exp.role || exp.title}
                    </h3>
                    <div className="text-xs text-indigo-400 font-semibold flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{exp.company || exp.organization}</span>
                      {exp.location && <span className="text-slate-500">• {exp.location}</span>}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                    {exp.employmentType || 'Role'}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 my-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate || 'Ongoing'}</span>
                </div>

                {exp.description && (
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                    {exp.description}
                  </p>
                )}

                {exp.technologies && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(Array.isArray(exp.technologies) ? exp.technologies : exp.technologies.split(',')).map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-800/60">
                <button
                  onClick={() => openEditModal(exp)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
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
      {viewMode === 'table' && experiences.length > 0 && (
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#0c0f1a]/85 backdrop-blur-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101424] text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Role & Title</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Tenure</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-sans">
              {experiences.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{exp.role || exp.title}</td>
                  <td className="py-3 px-4 text-indigo-400">{exp.company || exp.organization}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {exp.employmentType || 'Full-time'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(exp)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        title="Delete"
                      >
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
                <Briefcase className="w-4 h-4 text-blue-400" />
                {editingId ? 'Edit Experience Record' : 'Add Experience Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={e => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Google, Infosys, Startup"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Job Role / Title *</label>
                  <input
                    type="text"
                    required
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    placeholder="e.g. Full Stack Intern"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Employment Type</label>
                  <select
                    value={form.employmentType}
                    onChange={e => setForm({ ...form, employmentType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Bengaluru / Remote"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Start Date</label>
                  <input
                    type="text"
                    value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                    placeholder="e.g. June 2025"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">End Date</label>
                  <input
                    type="text"
                    disabled={form.isCurrent}
                    value={form.isCurrent ? 'Present' : form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                    placeholder="e.g. August 2025"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={form.isCurrent}
                  onChange={e => setForm({ ...form, isCurrent: e.target.checked })}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="isCurrent" className="text-slate-300 cursor-pointer">
                  I currently work in this role
                </label>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Technologies Used (Comma separated)</label>
                <input
                  type="text"
                  value={form.technologies}
                  onChange={e => setForm({ ...form, technologies: e.target.value })}
                  placeholder="e.g. React, Node.js, PostgreSQL, Docker"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Role Description & Key Accomplishments</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your responsibilities, architectures designed, and impact created..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
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
