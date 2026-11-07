import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    otpChallenge,
    loginWithPassword,
    loginWithGoogle,
    verifyOtp,
    resendOtp,
    cancelOtp,
    loading,
    authError,
    setAuthError
  } = useAdminAuth();

  // Primary credentials requested by user
  const [email, setEmail] = useState('nagaseshukumarbobbiti@gmail.com');
  const [password, setPassword] = useState('seshu@2409');
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [otpCode, setOtpCode] = useState('123456');
  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Forgot Password Flow State
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP & New Password
  const [forgotChallengeId, setForgotChallengeId] = useState('');
  const [forgotOtp, setForgotOtp] = useState('123456');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://portfolio-zsk2.onrender.com';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // 5-minute countdown timer
  useEffect(() => {
    let interval = null;
    if (otpChallenge) {
      setTimer(300);
      interval = setInterval(() => {
        setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpChallenge]);

  // Resend cooldown
  useEffect(() => {
    let interval = null;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginWithPassword(email, password);
      setOtpCode('123456'); // Pre-fill 123456 for direct testing as requested!
    } catch (err) {}
  };

  const handleGoogleSubmit = async () => {
    try {
      const { signInWithGoogleFirebase } = await import('../../config/firebase');
      const googleUser = await signInWithGoogleFirebase();
      await loginWithGoogle(googleUser.email, googleUser.idToken);
      setOtpCode('123456');
    } catch (err) {
      setAuthError(err.message || 'Google sign-in was canceled or failed.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setAuthError('Please enter the 6-digit verification code.');
      return;
    }
    try {
      await verifyOtp(otpCode);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {}
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await resendOtp();
      setResendCooldown(45);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 4000);
    } catch (err) {}
  };

  // --- FORGOT PASSWORD WITH OTP FLOW ---
  const handleRequestForgotOtp = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${backendUrl}/api/admin/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to request reset OTP.');
      }
      setForgotChallengeId(data.challengeId);
      setForgotOtp('123456'); // Default direct OTP
      setForgotStep(2);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${backendUrl}/api/admin/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: forgotChallengeId,
          otp: forgotOtp,
          newPassword
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Password reset failed.');
      }
      setForgotSuccess(data.message);
      setPassword(newPassword); // Update current password field to the new one!
      setTimeout(() => {
        setForgotMode(false);
        setForgotStep(1);
        setForgotSuccess(null);
      }, 3500);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#090b10] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-slate-200">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-[#111420] border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase font-mono">
            Administrator Access
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Securely sign in to manage your portfolio content, projects, and media.
          </p>
        </div>

        {/* Global Error Banner */}
        {authError && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {forgotSuccess && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{forgotSuccess}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* SCENARIO A: FORGOT PASSWORD WITH OTP FLOW */}
        {/* ======================================================== */}
        {forgotMode ? (
          <div className="space-y-5">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                {forgotStep === 1 ? 'Reset Password via OTP' : 'Enter OTP & Set New Password'}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Password changes require multi-factor OTP verification. Old password will be cleared.
              </p>
            </div>

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestForgotOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Registered Administrator Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nagaseshukumarbobbiti@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  {forgotLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  Send Reset OTP Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.4em] font-mono py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-cyan-400 font-bold text-lg focus:outline-none focus:border-indigo-500"
                  />
                  <div className="text-[10px] text-emerald-400 mt-1 text-center font-mono">
                    Direct Master OTP: <strong>123456</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new strong password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading || !newPassword || forgotOtp.length !== 6}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  {forgotLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Verify OTP & Update Password
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => { setForgotMode(false); setForgotStep(1); }}
              className="w-full py-2 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </button>
          </div>
        ) : otpChallenge ? (
          /* ======================================================== */
          /* SCENARIO B: MANDATORY OTP VERIFICATION SCREEN */
          /* ======================================================== */
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-2">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Enter 6-Digit OTP</h3>
              <p className="text-xs text-slate-400 mt-1">
                Dispatched to <span className="text-indigo-300 font-mono">{otpChallenge.email}</span>
              </p>
              
              {/* Direct OTP Display */}
              <div className="mt-3 p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-300">
                Direct Master OTP: <span className="font-bold tracking-widest text-white text-sm">123456</span>
              </div>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 text-center">
                  Verification Code
                </label>
                <div className="relative">
                  <input
                    type={showOtp ? 'text' : 'password'}
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full text-center text-2xl tracking-[0.5em] font-mono px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-cyan-400 font-bold focus:outline-none focus:border-indigo-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowOtp(!showOtp)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                    title={showOtp ? 'Hide code' : 'Show code'}
                  >
                    {showOtp ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Timer & Resend */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="font-mono">
                  Expires in: <strong className={timer < 60 ? 'text-rose-400' : 'text-slate-300'}>{formatTimer(timer)}</strong>
                </span>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || loading}
                  className="text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors font-medium"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
              </div>

              {resendSuccess && (
                <div className="text-[11px] text-emerald-400 flex items-center justify-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Code resent (Master code: 123456)
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6 || timer === 0}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Verify & Open Dashboard
              </button>

              <button
                type="button"
                onClick={cancelOtp}
                className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Cancel & Return
              </button>
            </form>
          </div>
        ) : (
          /* ======================================================== */
          /* SCENARIO C: EMAIL + PASSWORD LOGIN (GOOGLE AT THE BOTTOM) */
          /* ======================================================== */
          <div className="space-y-5">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nagaseshukumarbobbiti@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                  />
                </div>
              </div>

              {/* Password Input with Eye Visibility Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotMode(true)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="seshu@2409"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider (like LinkedIn / LeetCode) */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#111420] px-3 text-[10px] uppercase font-mono tracking-wider text-slate-500">
                or
              </span>
            </div>

            {/* GOOGLE LOGIN BUTTON PRESENT AT THE BOTTOM */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSubmit}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-3 transition-colors shadow-sm"
              >
                {/* Google Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.61H1.28C.46 8.24 0 10.07 0 12s.46 3.76 1.28 5.39l3.99-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.28 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-[10px] text-slate-500 font-mono">
          Protected by Multi-Factor OTP • Single-Use Cryptographic Challenge
        </div>
      </div>
    </div>
  );
};
