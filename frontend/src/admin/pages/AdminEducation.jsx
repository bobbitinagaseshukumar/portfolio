import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  GraduationCap,
  CheckCircle2,
  School,
  Building2,
  BookOpen,
  Layers,
  Save,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  Filter,
  Table as TableIcon,
  LayoutGrid
} from 'lucide-react';

export const AdminEducation = () => {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://portfolio-zsk2.onrender.com';

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

  const handleOpenAdd = (defaultType = 'college') => {
    setEditingItem({
      institutionName: '',
      institutionType: defaultType,
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
        setNotification('Education record saved successfully! Reflects immediately on live website.');
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

  const handleTogglePublish = async (item) => {
    try {
      const updated = { ...item, isPublished: !item.isPublished };
      const res = await fetch(`${backendUrl}/api/admin/education/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        fetchEducation();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredList = selectedCategory === 'all'
    ? educationList
    : educationList.filter(item => item.institutionType === selectedCategory);

  const schoolCount = educationList.filter(e => e.institutionType === 'school').length;
  const interCount = educationList.filter(e => e.institutionType === 'intermediate').length;
  const degreeCount = educationList.filter(e => ['college', 'university', 'btech'].includes(e.institutionType)).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
            Education & Academic Qualifications
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organized into dedicated category boxes: School, Intermediate, and Engineering College degrees.
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd('college')}
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

      {/* ======================================================== */}
      {/* 📦 3 DEDICATED CATEGORY BOXES                            */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* BOX 1: School */}
        <div 
          onClick={() => setSelectedCategory(selectedCategory === 'school' ? 'all' : 'school')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            selectedCategory === 'school'
              ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md shadow-cyan-500/10'
              : 'bg-[#0e111a] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <School className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400">Section Box 01</span>
              <h3 className="text-xs font-bold text-white">School (10th / SSC)</h3>
              <span className="text-[11px] text-cyan-400 font-mono">{schoolCount} Record(s)</span>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleOpenAdd('school'); }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
            title="Add School Record"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* BOX 2: Intermediate */}
        <div 
          onClick={() => setSelectedCategory(selectedCategory === 'intermediate' ? 'all' : 'intermediate')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            selectedCategory === 'intermediate'
              ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-500/10'
              : 'bg-[#0e111a] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400">Section Box 02</span>
              <h3 className="text-xs font-bold text-white">Intermediate (+2 / MPC)</h3>
              <span className="text-[11px] text-emerald-400 font-mono">{interCount} Record(s)</span>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleOpenAdd('intermediate'); }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
            title="Add Intermediate Record"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* BOX 3: Degree / B.Tech */}
        <div 
          onClick={() => setSelectedCategory(selectedCategory === 'college' ? 'all' : 'college')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            selectedCategory === 'college'
              ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md shadow-indigo-500/10'
              : 'bg-[#0e111a] border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400">Section Box 03</span>
              <h3 className="text-xs font-bold text-white">B.Tech / Degree College</h3>
              <span className="text-[11px] text-indigo-400 font-mono">{degreeCount} Record(s)</span>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleOpenAdd('college'); }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
            title="Add Degree Record"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Filter & View Switcher Bar */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            Category Filter:
          </span>
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {['all', 'school', 'intermediate', 'college'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Table View"
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Card Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DATA VIEW: TABLE OR CARDS                                */}
      {/* ======================================================== */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
          Loading education records...
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0e111a] border border-slate-800 space-y-3">
          <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No Education Records in this Category</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Zero fake data is currently in the database. Use "Add Education Record" above to add your verified school, intermediate, or college credentials.
          </p>
          <button
            onClick={() => handleOpenAdd(selectedCategory !== 'all' ? selectedCategory : 'college')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-400 text-xs font-semibold inline-flex items-center gap-1.5 mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Details Now
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0e111a]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Type / Box</th>
                <th className="py-3 px-4">Institution Name</th>
                <th className="py-3 px-4">Degree / Course</th>
                <th className="py-3 px-4">Branch / Stream</th>
                <th className="py-3 px-4">Academic Year</th>
                <th className="py-3 px-4">Score / CGPA</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                      item.institutionType === 'school'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        : item.institutionType === 'intermediate'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {item.institutionType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">
                    {item.institutionName}
                    {item.isCurrent && (
                      <span className="ml-2 text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                        Current
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300">{item.degree || '—'}</td>
                  <td className="py-3 px-4 text-cyan-400">{item.branchOrField || '—'}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{item.academicYear || '—'}</td>
                  <td className="py-3 px-4 font-mono font-bold text-white">{item.scoreOrCgpa || '—'}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleTogglePublish(item)}
                      className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border transition-colors ${
                        item.isPublished
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {item.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {item.isPublished ? 'Published' : 'Hidden'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                        title="Edit Record"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800"
                        title="Delete Record"
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
      ) : (
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#0e111a] border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                    item.institutionType === 'school'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      : item.institutionType === 'intermediate'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {item.institutionType}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mb-0.5">{item.institutionName}</h3>
                <div className="text-xs text-cyan-400 font-medium mb-2">
                  {item.degree} • {item.branchOrField}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mb-2">
                  Years: {item.academicYear} | Score: {item.scoreOrCgpa || 'N/A'}
                </div>
                {item.description && (
                  <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs mt-3">
                <span className="text-[10px] text-slate-500 font-mono">
                  {item.location || 'Location not set'}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  item.isPublished ? 'text-emerald-400 bg-emerald-950/40' : 'text-slate-400 bg-slate-900'
                }`}>
                  {item.isPublished ? '● Published' : '○ Hidden'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT RECORD                                 */}
      {/* ======================================================== */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111420] border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                {editingItem.id ? 'Edit Education Record' : 'Add Education Record'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Institution Category / Box *</label>
                  <select
                    value={editingItem.institutionType}
                    onChange={(e) => setEditingItem({ ...editingItem, institutionType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    required
                  >
                    <option value="school">School (10th / Secondary)</option>
                    <option value="intermediate">Intermediate (+2 / Junior College)</option>
                    <option value="college">B.Tech / Degree College</option>
                    <option value="university">University / Higher Studies</option>
                    <option value="other">Other Qualification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Institution Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.institutionName}
                    onChange={(e) => setEditingItem({ ...editingItem, institutionName: e.target.value })}
                    placeholder="e.g. Stanford University / Narayana Junior College"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Degree / Certificate</label>
                  <input
                    type="text"
                    value={editingItem.degree}
                    onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                    placeholder="e.g. B.Tech / Senior Secondary / SSC"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Branch / Stream / Major</label>
                  <input
                    type="text"
                    value={editingItem.branchOrField}
                    onChange={(e) => setEditingItem({ ...editingItem, branchOrField: e.target.value })}
                    placeholder="e.g. Computer Science Engineering / MPC"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Academic Years</label>
                  <input
                    type="text"
                    value={editingItem.academicYear}
                    onChange={(e) => setEditingItem({ ...editingItem, academicYear: e.target.value })}
                    placeholder="e.g. 2022 - 2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Score / CGPA / %</label>
                  <input
                    type="text"
                    value={editingItem.scoreOrCgpa}
                    onChange={(e) => setEditingItem({ ...editingItem, scoreOrCgpa: e.target.value })}
                    placeholder="e.g. 9.2 CGPA or 95%"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    placeholder="City, State"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Description / Highlights</label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Key coursework, honors, leadership roles, or achievements..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isCurrent}
                    onChange={(e) => setEditingItem({ ...editingItem, isCurrent: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-slate-300">Currently studying here</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isPublished}
                    onChange={(e) => setEditingItem({ ...editingItem, isPublished: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-700 text-emerald-600 focus:ring-0"
                  />
                  <span className="text-slate-300">Publish immediately on website</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/30"
                >
                  <Save className="w-4 h-4" />
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
