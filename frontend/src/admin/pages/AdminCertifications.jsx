import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ExternalLink,
  Table,
  LayoutGrid,
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAdminTheme } from '../context/AdminThemeContext';

export const AdminCertifications = () => {
  const { theme } = useAdminTheme();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({
    name: '',
    issuingOrganization: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    verificationUrl: '',
    description: '',
    isFeatured: false
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://portfolio-zsk2.onrender.com';

  const showNotice = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/certifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) setCerts(data.data || []);
    } catch (err) {
      console.warn('Failed to fetch certs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      name: '',
      issuingOrganization: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      verificationUrl: '',
      description: '',
      isFeatured: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingId(c.id);
    setForm({
      name: c.name || '',
      issuingOrganization: c.issuingOrganization || c.issuer || '',
      issueDate: c.issueDate || '',
      expiryDate: c.expiryDate || '',
      credentialId: c.credentialId || '',
      verificationUrl: c.verificationUrl || '',
      description: c.description || '',
      isFeatured: Boolean(c.isFeatured)
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.issuingOrganization) {
      showNotice('Certificate name and issuer are required.', 'error');
      return;
    }

    try {
      const url = editingId
        ? `${backendUrl}/api/admin/certifications/${editingId}`
        : `${backendUrl}/api/admin/certifications`;
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
        showNotice(editingId ? 'Certification updated.' : 'Certification added.');
        setIsModalOpen(false);
        fetchCerts();
      } else {
        showNotice(data.error || 'Failed to save certification.', 'error');
      }
    } catch (err) {
      showNotice(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certification record?')) return;
    try {
      const res = await fetch(`${backendUrl}/api/admin/certifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        showNotice('Certification deleted.');
        fetchCerts();
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
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-2">
            <Award className="w-3.5 h-3.5" />
            BOX 08 • Verified Accreditations
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Certifications & Badges
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your verified industry licenses, cloud certifications, and technical accreditations.
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
            <span>Add Certificate</span>
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
      {certs.length === 0 && !loading && (
        <div className="p-12 rounded-3xl bg-[#0c0f1a]/80 backdrop-blur-xl border border-slate-800/80 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Certifications Stored Yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Your database has zero fake certificates. Click "Add Certificate" to add AWS, Google, or university accreditations.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700"
          >
            + Add First Certification
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && certs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certs.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-[#0c0f1a]/85 backdrop-blur-xl border border-slate-800/80 hover:border-purple-500/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                        {c.name}
                      </h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {c.issuingOrganization || c.issuer} • <span className="font-mono text-[11px] text-indigo-400">{c.issueDate}</span>
                      </div>
                    </div>
                  </div>
                  {c.isFeatured && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>

                {c.credentialId && (
                  <div className="text-[11px] font-mono text-slate-500 mt-2">
                    ID: {c.credentialId}
                  </div>
                )}

                {c.description && (
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {c.description}
                  </p>
                )}

                {c.verificationUrl && (
                  <div className="mt-3">
                    <a
                      href={c.verificationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                    >
                      <span>Verify Certificate</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-800/60">
                <button
                  onClick={() => openEditModal(c)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
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
      {viewMode === 'table' && certs.length > 0 && (
        <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#0c0f1a]/85 backdrop-blur-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101424] text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Certification</th>
                <th className="py-3 px-4">Issuing Body</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Credential ID</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {certs.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{c.name}</td>
                  <td className="py-3 px-4 text-indigo-400">{c.issuingOrganization || c.issuer}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{c.issueDate}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{c.credentialId || '—'}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(c)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
                        <Edit2 className="w-3.5 h-3.5 text-purple-400" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
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
                <Award className="w-4 h-4 text-purple-400" />
                {editingId ? 'Edit Certification' : 'Add Certification'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Certification Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. AWS Certified Solutions Architect, Google Cloud Associate"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Issuing Organization *</label>
                  <input
                    type="text"
                    required
                    value={form.issuingOrganization}
                    onChange={e => setForm({ ...form, issuingOrganization: e.target.value })}
                    placeholder="e.g. Amazon Web Services, Google"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Issue Date</label>
                  <input
                    type="text"
                    value={form.issueDate}
                    onChange={e => setForm({ ...form, issueDate: e.target.value })}
                    placeholder="e.g. October 2025"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Credential ID (Optional)</label>
                  <input
                    type="text"
                    value={form.credentialId}
                    onChange={e => setForm({ ...form, credentialId: e.target.value })}
                    placeholder="e.g. AWS-9921-X9"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Verification URL</label>
                  <input
                    type="url"
                    value={form.verificationUrl}
                    onChange={e => setForm({ ...form, verificationUrl: e.target.value })}
                    placeholder="https://credly.com/..."
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Brief Description</label>
                <textarea
                  rows="2"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Topics covered, skills validated..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeaturedCert"
                  checked={form.isFeatured}
                  onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="isFeaturedCert" className="text-slate-300 cursor-pointer">
                  Highlight as featured credential on public portfolio
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
