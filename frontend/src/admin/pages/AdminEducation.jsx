import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, GraduationCap, CheckCircle2, School, Building2, Save, X, RefreshCw } from 'lucide-react';

export const AdminEducation = () => {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const fetchEducation = () => {
    fetch(`${backendUrl}/api/admin/education`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEducationList(data.data);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      institutionName: '',
      institutionType: 'college',
      degree: '',
      branchOrField: '',
      academicYear: '',
      scoreOrCgpa: '',
      location: '',
      isCurrent: false,
      description: '',
      isPublished: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    const isNew = !editingItem.id || editingItem.id.startsWith('temp-');
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew
      ? `${backendUrl}/api/admin/education`
      : `${backendUrl}/api/admin/education/${editingItem.id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(editingItem)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchEducation();
        setNotification('Education record saved successfully! Click "Publish Changes" to push live.');
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this educational record?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/admin/education/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchEducation();
        setNotification('Record removed.');
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
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Education Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your schools, colleges, engineering degrees, and academic milestones displayed on the public timeline.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education Record</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Education List */}
      {loading ? (
        <div className="p-8 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
          Loading records...
        </div>
      ) : educationList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0f121d] border border-slate-800">
          <GraduationCap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white">No Education Records Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Add your high school, senior secondary, and engineering college degrees.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {educationList.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#0f121d] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-slate-700 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  {item.institutionType === 'school' ? (
                    <School className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Building2 className="w-5 h-5 text-indigo-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{item.institutionName}</h3>
                    {item.isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-cyan-400 font-medium mt-0.5">
                    {item.degree} • {item.branchOrField}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Year: {item.academicYear} | Score: {item.scoreOrCgpa || 'N/A'}
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111420] border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">
                {editingItem.id ? 'Edit Education Record' : 'Add New Education Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Institution Name *</label>
                <input
                  type="text"
                  required
                  value={editingItem.institutionName}
                  onChange={(e) => setEditingItem({ ...editingItem, institutionName: e.target.value })}
                  placeholder="e.g. Cambridge Institute of Technology"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Institution Type</label>
                  <select
                    value={editingItem.institutionType}
                    onChange={(e) => setEditingItem({ ...editingItem, institutionType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="college">College / University</option>
                    <option value="school">High School</option>
                    <option value="other">Other Academy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Academic Year</label>
                  <input
                    type="text"
                    value={editingItem.academicYear}
                    onChange={(e) => setEditingItem({ ...editingItem, academicYear: e.target.value })}
                    placeholder="2022 - 2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Degree / Course</label>
                  <input
                    type="text"
                    value={editingItem.degree}
                    onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                    placeholder="B.Tech / 12th Grade"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Branch / Specialization</label>
                  <input
                    type="text"
                    value={editingItem.branchOrField}
                    onChange={(e) => setEditingItem({ ...editingItem, branchOrField: e.target.value })}
                    placeholder="Computer Science"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Score / CGPA</label>
                  <input
                    type="text"
                    value={editingItem.scoreOrCgpa}
                    onChange={(e) => setEditingItem({ ...editingItem, scoreOrCgpa: e.target.value })}
                    placeholder="e.g. 8.9 CGPA / 94%"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Location</label>
                  <input
                    type="text"
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Specializations, honors, projects completed during this period..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={editingItem.isCurrent || false}
                  onChange={(e) => setEditingItem({ ...editingItem, isCurrent: e.target.checked })}
                  className="rounded border-slate-800 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="isCurrent" className="text-slate-300">Currently studying here</label>
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
