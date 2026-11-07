import React, { useState, useEffect } from 'react';
import { History, Shield, Clock, RefreshCw } from 'lucide-react';

export const AdminActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/audit-logs`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogs(data.data);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Administrative Activity Logs</h1>
        <p className="text-xs text-slate-400 mt-1">
          Immutable audit trail of authentication events, profile modifications, content updates, and publishes.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
          Loading audit trail...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0f121d]">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Administrator</th>
                <th className="px-4 py-3">Action Type</th>
                <th className="px-4 py-3">Target Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-indigo-300">{log.adminEmail}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-cyan-400 border border-indigo-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{log.entityType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
