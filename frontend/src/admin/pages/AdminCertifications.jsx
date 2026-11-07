import React, { useState, useEffect } from 'react';
import { Award, Plus, Trash2, CheckCircle2, ExternalLink } from 'lucide-react';

export const AdminCertifications = () => {
  const [certs, setCerts] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/certifications`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then(res => res.json())
      .then(d => { if (d.success) setCerts(d.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Certifications Management</h1>
        <p className="text-xs text-slate-400 mt-1">
          Add and showcase your professional accreditations and verifiable credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certs.map((c) => (
          <div key={c.id} className="p-5 rounded-2xl bg-[#0f121d] border border-slate-800 flex flex-col justify-between text-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-indigo-400 font-mono text-[11px]">{c.credentialId}</span>
                {c.isFeatured && <span className="text-amber-400 text-[10px]">★ Featured</span>}
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{c.name}</h3>
              <p className="text-slate-400 text-[11px]">{c.issuingOrganization} • {c.issueDate}</p>
              <p className="text-slate-400 mt-2 text-xs leading-relaxed">{c.description}</p>
            </div>
            {c.verificationUrl && (
              <div className="pt-3 border-t border-slate-800/80 mt-3">
                <a href={c.verificationUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
