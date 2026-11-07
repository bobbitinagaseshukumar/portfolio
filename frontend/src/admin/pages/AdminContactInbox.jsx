import React, { useState, useEffect } from 'react';
import { Mail, Clock, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';

export const AdminContactInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${backendUrl}/api/contact`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then(res => res.json())
      .then(d => { if (d.success && d.data) setMessages(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Contact Messages Inbox</h1>
        <p className="text-xs text-slate-400 mt-1">
          Inquiries and messages submitted by visitors through the public portfolio.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
          Loading inbox...
        </div>
      ) : messages.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0f121d] border border-slate-800 text-xs">
          <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <h3 className="font-semibold text-white">No Messages Yet</h3>
          <p className="text-slate-400 mt-1">Messages sent through the public contact form will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#0f121d] border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-sm">{m.name}</h4>
                  <div className="text-indigo-400 font-mono text-[11px]">{m.email}</div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(m.created_at || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-300 pt-1 leading-relaxed">{m.message}</p>
              {m.screen_device && (
                <div className="text-[10px] font-mono text-cyan-400/80 pt-1">
                  Device: {m.screen_device} ({m.screen_resolution})
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
