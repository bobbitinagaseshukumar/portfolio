import React, { useState, useEffect } from 'react';
import {
  Mail,
  Clock,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink,
  MessageSquare,
  Smartphone,
  Send
} from 'lucide-react';
import { useAdminTheme } from '../context/AdminThemeContext';

export const AdminContactInbox = () => {
  const { theme } = useAdminTheme();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://portfolio-zsk2.onrender.com';

  const showNotice = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchMessages = () => {
    setLoading(true);
    fetch(`${backendUrl}/api/contact`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    })
      .then(res => res.json())
      .then(d => {
        if (d.success && d.data) {
          setMessages(d.data);
        } else if (Array.isArray(d)) {
          setMessages(d);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(m => {
    const q = search.toLowerCase();
    return (
      (m.name || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q) ||
      (m.message || '').toLowerCase().includes(q) ||
      (m.subject || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
            <Mail className="w-3.5 h-3.5" />
            Inbox & Telemetry
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Contact Messages & Inquiries
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visitor submissions, collaboration proposals, and recruiting inquiries received via your portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search inquiries..."
              className="pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={fetchMessages}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Refresh Inbox"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs">
          {notification}
        </div>
      )}

      {/* Messages List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
          Checking inbox...
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0c0f1a]/80 backdrop-blur-xl border border-slate-800/80 text-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-sm">No Messages In Inbox</h3>
          <p className="text-slate-400 max-w-sm mx-auto">
            When recruiters or collaborators submit the form on your portfolio website, their verified messages will arrive here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((m, idx) => (
            <div
              key={m.id || idx}
              className="p-5 rounded-2xl bg-[#0c0f1a]/85 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700 transition-all text-xs space-y-3 shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {(m.name || 'V').substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{m.name}</h4>
                    <a
                      href={`mailto:${m.email}`}
                      className="text-indigo-400 hover:text-indigo-300 font-mono text-[11px]"
                    >
                      {m.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(m.created_at || m.receivedAt || Date.now()).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <a
                    href={`mailto:${m.email}?subject=Re: Portfolio Inquiry`}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    Reply
                  </a>
                </div>
              </div>

              {m.subject && (
                <div className="text-xs font-semibold text-slate-200">
                  Subject: <span className="text-white">{m.subject}</span>
                </div>
              )}

              <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/50">
                {m.message}
              </p>

              {m.screen_device && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400/70 pt-1">
                  <Smartphone className="w-3 h-3" />
                  <span>Sender Telemetry: {m.screen_device} ({m.screen_resolution})</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
