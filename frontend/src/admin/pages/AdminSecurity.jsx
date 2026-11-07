import React from 'react';
import { ShieldCheck, Lock, KeyRound, AlertTriangle, LogOut, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminSecurity = () => {
  const { adminUser, logout } = useAdminAuth();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Security & Multi-Factor Authentication</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review active administrator sessions, OTP policies, and cryptographic verification status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        
        {/* Account Status Card */}
        <div className="p-6 rounded-2xl bg-[#0f121d] border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Administrator Credentials</h3>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Authenticated Email:</span>
              <span className="text-white font-mono">{adminUser?.email || 'admin@portfolio.internal'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Assigned Role:</span>
              <span className="text-indigo-400 font-mono font-semibold">SUPER_ADMIN</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Mandatory Multi-Factor OTP:</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">OTP Code Lifespan:</span>
              <span className="text-slate-300 font-mono">300 Seconds (5 Minutes)</span>
            </div>
          </div>
        </div>

        {/* Security Controls */}
        <div className="p-6 rounded-2xl bg-[#0f121d] border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Lock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Active Session Management</h3>
            </div>
            <p className="text-slate-400 mt-3 leading-relaxed">
              Every authenticated login session requires OTP verification. Terminating your session clears your browser credentials and requires full MFA re-authentication.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={logout}
              className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/20 flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out of This Session
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
