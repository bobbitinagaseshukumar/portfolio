import React, { useState, useEffect } from 'react';
import { Trophy, Plus, ExternalLink } from 'lucide-react';

export const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/achievements`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then(res => res.json())
      .then(d => { if (d.success) setAchievements(d.data); })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Achievements & Honors</h1>
        <p className="text-xs text-slate-400 mt-1">
          Highlight hackathon victories, academic honors, and engineering accomplishments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((a) => (
          <div key={a.id} className="p-5 rounded-2xl bg-[#0f121d] border border-slate-800 text-xs">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">{a.title}</h3>
            </div>
            <div className="text-indigo-400 font-medium">{a.issuer} • {a.date}</div>
            <p className="text-slate-400 mt-2">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
