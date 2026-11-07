import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Lock,
  Globe,
  Share2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Image,
  Film,
  X,
  History,
  Save,
  Clock,
  Layers
} from 'lucide-react';

export const AdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  // Upload / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'certifications',
    description: '',
    visibility: 'PUBLIC', // 'PUBLIC', 'PRIVATE', 'UNLISTED'
    publicationStatus: 'published', // 'draft', 'pending', 'approved', 'published', 'hidden'
    showOnWebsite: true,
    allowPreview: true,
    allowDownload: true,
    issueDate: '',
    tags: ''
  });

  // Edit Metadata Modal
  const [editingDoc, setEditingDoc] = useState(null);

  // Replace File Modal
  const [replaceDoc, setReplaceDoc] = useState(null);
  const [replaceFile, setReplaceFile] = useState(null);
  const [replaceSummary, setReplaceSummary] = useState('');

  // Version History Modal
  const [historyDoc, setHistoryDoc] = useState(null);
  const [versions, setVersions] = useState([]);

  // Preview Modal
  const [previewDoc, setPreviewDoc] = useState(null);

  const fileInputRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://portfolio-zsk2.onrender.com';

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'resume', label: 'Resume' },
    { id: 'degree', label: 'B.Tech / Degree' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'school', label: 'School' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'projects', label: 'Projects' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'personal', label: 'Personal' },
    { id: 'other', label: 'Other Docs' }
  ];

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/admin/documents`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setDocuments(data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleOpenUpload = () => {
    setSelectedFile(null);
    setFormData({
      title: '',
      category: selectedCategory !== 'all' ? selectedCategory : 'certifications',
      description: '',
      visibility: 'PUBLIC',
      publicationStatus: 'published',
      showOnWebsite: true,
      allowPreview: true,
      allowDownload: true,
      issueDate: '',
      tags: ''
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!formData.title) {
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setFormData(prev => ({ ...prev, title: nameWithoutExt }));
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    setUploadProgress(true);
    const data = new FormData();
    data.append('file', selectedFile);
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('visibility', formData.visibility);
    data.append('publicationStatus', formData.publicationStatus);
    data.append('showOnWebsite', formData.showOnWebsite);
    data.append('allowPreview', formData.allowPreview);
    data.append('allowDownload', formData.allowDownload);
    data.append('issueDate', formData.issueDate);
    data.append('tags', formData.tags);

    try {
      const res = await fetch(`${backendUrl}/api/admin/documents/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
        body: data
      });
      const resData = await res.json();
      if (resData.success) {
        setIsModalOpen(false);
        fetchDocuments();
        setNotification('Document uploaded successfully with configured visibility!');
        setTimeout(() => setNotification(null), 4000);
      } else {
        alert(resData.error || 'Upload failed.');
      }
    } catch (err) {
      alert('Upload request failed: ' + err.message);
    } finally {
      setUploadProgress(false);
    }
  };

  const handleUpdatePermissions = async (docId, updates) => {
    try {
      const res = await fetch(`${backendUrl}/api/admin/documents/${docId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setDocuments(prev => prev.map(d => d.id === docId ? data.data : d));
        setNotification('Permissions updated.');
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Are you sure you want to delete "${doc.title}"? It will be immediately revoked from all public access.`)) {
      return;
    }
    try {
      const res = await fetch(`${backendUrl}/api/admin/documents/${doc.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setDocuments(prev => prev.filter(d => d.id !== doc.id));
        setNotification(`"${doc.title}" deleted.`);
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenReplace = (doc) => {
    setReplaceDoc(doc);
    setReplaceFile(null);
    setReplaceSummary('');
  };

  const handleReplaceSubmit = async (e) => {
    e.preventDefault();
    if (!replaceFile) {
      alert('Please choose a replacement file.');
      return;
    }

    setUploadProgress(true);
    const data = new FormData();
    data.append('file', replaceFile);
    data.append('changeSummary', replaceSummary);

    try {
      const res = await fetch(`${backendUrl}/api/admin/documents/${replaceDoc.id}/replace`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
        body: data
      });
      const resData = await res.json();
      if (resData.success) {
        setReplaceDoc(null);
        fetchDocuments();
        setNotification(resData.message);
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadProgress(false);
    }
  };

  const handleOpenVersions = async (doc) => {
    setHistoryDoc(doc);
    try {
      const res = await fetch(`${backendUrl}/api/admin/documents/${doc.id}/versions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setVersions(data.data);
      }
    } catch (err) {}
  };

  const handleRestoreVersion = async (docId, versionId) => {
    if (!window.confirm('Restore this version as the active document?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/admin/documents/${docId}/restore/${versionId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setHistoryDoc(null);
        fetchDocuments();
        setNotification(data.message);
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {}
  };

  // Filtered documents
  const filteredDocs = documents.filter(doc => {
    const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesQuery = !searchQuery ||
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.originalFilename?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-indigo-400" />
            Documents & File Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload and control your degrees, school certificates, marksheets, resume, and project files with strict privacy permissions.
          </p>
        </div>

        <button
          onClick={handleOpenUpload}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto shadow-md shadow-indigo-600/30"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                selectedCategory === c.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
          Loading documents...
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#0f121d] border border-slate-800 text-xs">
          <UploadCloud className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-white text-sm mb-1">No Documents Uploaded Yet</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-5">
            Your real school certificates, college degrees, resume PDF, and project proof files will appear here once you upload them.
          </p>
          <button
            onClick={handleOpenUpload}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
          >
            Upload Your First Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-[#0f121d] border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition-all text-xs"
            >
              <div>
                {/* Header badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-900 text-indigo-300 border border-slate-800">
                    {doc.category}
                  </span>

                  {/* Visibility Badge */}
                  <span
                    className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                      doc.visibility === 'PUBLIC'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : doc.visibility === 'PRIVATE'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                    }`}
                  >
                    {doc.visibility === 'PUBLIC' ? (
                      <Globe className="w-3 h-3" />
                    ) : doc.visibility === 'PRIVATE' ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Share2 className="w-3 h-3" />
                    )}
                    {doc.visibility}
                  </span>
                </div>

                {/* Title & Filename */}
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
                  {doc.title}
                </h3>
                <div className="text-[11px] text-slate-500 font-mono truncate mb-2">
                  {doc.originalFilename} • {(doc.fileSize / 1024).toFixed(1)} KB
                </div>

                {doc.description && (
                  <p className="text-slate-400 text-xs line-clamp-2 mb-3 leading-relaxed">
                    {doc.description}
                  </p>
                )}

                {/* Granular Permission Toggles */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 mb-4 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Show on Website:</span>
                    <button
                      onClick={() => handleUpdatePermissions(doc.id, { showOnWebsite: !doc.showOnWebsite })}
                      className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                        doc.showOnWebsite ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {doc.showOnWebsite ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Visitor Preview:</span>
                    <button
                      onClick={() => handleUpdatePermissions(doc.id, { allowPreview: !doc.allowPreview })}
                      className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                        doc.allowPreview ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {doc.allowPreview ? 'ALLOWED' : 'BLOCKED'}
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Visitor Download:</span>
                    <button
                      onClick={() => handleUpdatePermissions(doc.id, { allowDownload: !doc.allowDownload })}
                      className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                        doc.allowDownload ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {doc.allowDownload ? 'ALLOWED' : 'BLOCKED'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {/* Admin Preview */}
                  <a
                    href={`${backendUrl}/api/admin/documents/${doc.id}/preview`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white"
                    title="Preview File"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </a>

                  {/* Admin Download */}
                  <a
                    href={`${backendUrl}/api/admin/documents/${doc.id}/preview?download=true`}
                    download
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white"
                    title="Download Privately"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>

                  {/* Version History */}
                  <button
                    onClick={() => handleOpenVersions(doc)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1"
                    title="Version History"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono">v{doc.versionNumber || 1}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Replace File */}
                  <button
                    onClick={() => handleOpenReplace(doc)}
                    className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px]"
                    title="Replace file with new version"
                  >
                    Replace
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(doc)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. UPLOAD NEW DOCUMENT MODAL */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#111420] border border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-indigo-400" />
                Upload Personal / Academic Document
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/60 transition-colors"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.svg,.mp4,.webm"
                />
                <UploadCloud className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                {selectedFile ? (
                  <div>
                    <span className="font-bold text-white">{selectedFile.name}</span>
                    <span className="block text-slate-500 text-[11px] font-mono mt-0.5">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Click to change file
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-slate-300 font-medium">Click or Drag & Drop file here</span>
                    <span className="block text-slate-500 text-[11px] mt-1">
                      Supports PDF documents, JPG/PNG certificates, and MP4 videos (Up to 50MB)
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Document Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. B.Tech Provisional Degree / React Certificate"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="resume">Resume PDF</option>
                    <option value="degree">B.Tech / Degree Education</option>
                    <option value="intermediate">Intermediate Education</option>
                    <option value="school">School Education</option>
                    <option value="certifications">Certifications</option>
                    <option value="projects">Project Document / Video</option>
                    <option value="achievements">Achievements</option>
                    <option value="personal">Personal Documents</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details, issuing organization, or grade..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* VISIBILITY CONTROLS (CRITICAL) */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="font-bold text-white block">Visibility & Permissions</span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, visibility: 'PUBLIC' })}
                    className={`py-2 px-2 rounded-xl text-center font-mono text-[11px] border transition-all ${
                      formData.visibility === 'PUBLIC'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    PUBLIC
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, visibility: 'PRIVATE' })}
                    className={`py-2 px-2 rounded-xl text-center font-mono text-[11px] border transition-all ${
                      formData.visibility === 'PRIVATE'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    PRIVATE (Admin)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, visibility: 'UNLISTED' })}
                    className={`py-2 px-2 rounded-xl text-center font-mono text-[11px] border transition-all ${
                      formData.visibility === 'UNLISTED'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    UNLISTED
                  </button>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showOnWebsite}
                      onChange={(e) => setFormData({ ...formData, showOnWebsite: e.target.checked })}
                      className="rounded border-slate-800 text-indigo-600"
                    />
                    <span className="text-slate-300">Show document card on public portfolio</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowPreview}
                      onChange={(e) => setFormData({ ...formData, allowPreview: e.target.checked })}
                      className="rounded border-slate-800 text-indigo-600"
                    />
                    <span className="text-slate-300">Allow visitors to preview file online</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowDownload}
                      onChange={(e) => setFormData({ ...formData, allowDownload: e.target.checked })}
                      className="rounded border-slate-800 text-indigo-600"
                    />
                    <span className="text-slate-300">Allow visitors to download file</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadProgress || !selectedFile}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {uploadProgress ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{uploadProgress ? 'Uploading...' : 'Upload Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. REPLACE FILE / NEW VERSION MODAL */}
      {/* ======================================================== */}
      {replaceDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#111420] border border-slate-800 rounded-2xl p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                Replace File: <span className="text-indigo-400">{replaceDoc.title}</span>
              </h3>
              <button onClick={() => setReplaceDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-400">
              Uploading a new file will create <strong>Version {(replaceDoc.versionNumber || 1) + 1}</strong>. The previous version will be preserved in your history.
            </p>

            <form onSubmit={handleReplaceSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Choose New File</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setReplaceFile(e.target.files[0])}
                  className="w-full text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Change Summary</label>
                <input
                  type="text"
                  value={replaceSummary}
                  onChange={(e) => setReplaceSummary(e.target.value)}
                  placeholder="e.g. Updated resume with recent certifications"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReplaceDoc(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadProgress || !replaceFile}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  {uploadProgress ? 'Replacing...' : 'Upload New Version'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. VERSION HISTORY MODAL */}
      {/* ======================================================== */}
      {historyDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111420] border border-slate-800 rounded-2xl p-6 shadow-2xl text-xs space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                Version History: {historyDoc.title}
              </h3>
              <button onClick={() => setHistoryDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-indigo-300">
              Active version: <strong>v{historyDoc.versionNumber || 1}</strong> ({historyDoc.originalFilename})
            </div>

            {versions.length === 0 ? (
              <p className="text-slate-500 italic py-4 text-center">No older versions recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">Version {ver.versionNumber}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(ver.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {ver.originalFilename} • {(ver.fileSize / 1024).toFixed(1)} KB
                      </div>
                      {ver.changeSummary && (
                        <div className="text-[11px] text-slate-300 mt-1 italic">
                          "{ver.changeSummary}"
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleRestoreVersion(historyDoc.id, ver.id)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-[11px]"
                    >
                      Rollback
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
