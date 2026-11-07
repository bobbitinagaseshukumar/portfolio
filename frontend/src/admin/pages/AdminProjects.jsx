import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, FolderGit2, Video, ExternalLink, CheckCircle2, Save, X, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { GithubIcon } from '../../components/ui/Icons';

export const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const fetchProjects = () => {
    fetch(`${backendUrl}/api/admin/projects`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProjects(data.data);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject({
      title: '',
      slug: '',
      category: '3D & Creative Web',
      shortDescription: '',
      fullDescription: '',
      technologiesText: 'Three.js, React, Tailwind CSS',
      featuresText: 'Responsive 3D Canvas, Dynamic FOV',
      videoUrl: '/videos/demo.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      projectYear: '2025',
      isFeatured: false,
      isPublished: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setEditingProject({
      ...proj,
      technologiesText: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '',
      featuresText: Array.isArray(proj.features) ? proj.features.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    const isNew = !editingProject.id || editingProject.id.startsWith('temp-');
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew
      ? `${backendUrl}/api/admin/projects`
      : `${backendUrl}/api/admin/projects/${editingProject.id}`;

    const payload = {
      ...editingProject,
      technologies: editingProject.technologiesText
        ? editingProject.technologiesText.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      features: editingProject.featuresText
        ? editingProject.featuresText.split(',').map((f) => f.trim()).filter(Boolean)
        : []
    };

    try {
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
        setIsModalOpen(false);
        fetchProjects();
        setNotification('Project saved successfully! Remember to click "Publish Changes" to update public visitors.');
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchProjects();
        setNotification('Project removed.');
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (proj) => {
    try {
      await fetch(`${backendUrl}/api/admin/projects/${proj.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ ...proj, isPublished: !proj.isPublished })
      });
      fetchProjects();
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Project Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage projects, upload videos to <code className="text-cyan-400 font-mono">/videos/</code>, edit tech stacks and publish states.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Projects List */}
      {loading ? (
        <div className="p-8 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
          Loading projects...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-[#0f121d] border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition-all"
            >
              <div>
                {/* Thumbnail & Video Banner */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 mb-4 border border-slate-800">
                  <img
                    src={proj.thumbnail}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900/90 text-cyan-300 border border-slate-700">
                      {proj.category}
                    </span>
                    {proj.isFeatured && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded bg-black/80 text-[10px] text-slate-300 font-mono">
                    <Video className="w-3 h-3 text-indigo-400" />
                    <span className="truncate max-w-[120px]">{proj.videoUrl || 'No video'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {proj.title}
                  </h3>
                  <button
                    onClick={() => togglePublish(proj)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                      proj.isPublished
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {proj.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {proj.isPublished ? 'Published' : 'Draft'}
                  </button>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                  {proj.shortDescription}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {proj.technologies?.map((tech, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="hover:text-white">
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="hover:text-white">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#111420] border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white">
                {editingProject.id ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <input
                    type="text"
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Short Description (Cards) *</label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.shortDescription}
                  onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Full Case-Study Description</label>
                <textarea
                  rows={3}
                  value={editingProject.fullDescription}
                  onChange={(e) => setEditingProject({ ...editingProject, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    Video File Path (In public/videos)
                  </label>
                  <input
                    type="text"
                    value={editingProject.videoUrl}
                    onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value })}
                    placeholder="/videos/your-demo.mp4"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Thumbnail Image URL</label>
                  <input
                    type="text"
                    value={editingProject.thumbnail}
                    onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Technologies (Comma separated)
                </label>
                <input
                  type="text"
                  value={editingProject.technologiesText}
                  onChange={(e) => setEditingProject({ ...editingProject, technologiesText: e.target.value })}
                  placeholder="Three.js, React, Tailwind CSS, Express"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Live Website URL</label>
                  <input
                    type="text"
                    value={editingProject.liveUrl}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">GitHub Repository URL</label>
                  <input
                    type="text"
                    value={editingProject.githubUrl}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.isPublished || false}
                    onChange={(e) => setEditingProject({ ...editingProject, isPublished: e.target.checked })}
                    className="rounded border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-slate-300 font-medium">Published (Visible on site)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.isFeatured || false}
                    onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                    className="rounded border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-slate-300 font-medium">Featured Badge</span>
                </label>
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
