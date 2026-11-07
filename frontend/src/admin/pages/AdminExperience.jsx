import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Trash2, Edit2, CheckCircle2, Save, X } from 'lucide-react';

export const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [notification, setNotification] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/public-content`)
      .then(res => res.json())
      .then(d => { if (d.data?.experiences) setExperiences(d.data.experiences); })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Experience & Journey Timeline</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your career milestones, internships, and development journey.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="p-5 rounded-2xl bg-[#0f121d] border border-slate-800 flex items-start justify-between text-xs">
            <div>
              <h3 className="text-sm font-bold text-white">{exp.title}</h3>
              <div className="text-indigo-400 font-medium mt-0.5">{exp.organization} • {exp.location}</div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">{exp.startDate} - {exp.endDate}</div>
              <p className="text-slate-400 mt-2 max-w-xl">{exp.description}</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Published
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
