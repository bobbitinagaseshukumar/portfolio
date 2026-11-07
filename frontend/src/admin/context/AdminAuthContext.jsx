import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('admin_token'));
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [otpChallenge, setOtpChallenge] = useState(() => {
    const saved = sessionStorage.getItem('otp_challenge');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://portfolio-zsk2.onrender.com';

  // Check auth state on mount
  useEffect(() => {
    if (adminToken) {
      fetch(`${backendUrl}/api/admin/auth/me`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            logout();
          }
        })
        .catch(() => {});
    }
  }, [adminToken]);

  // Step 1: Password Login -> Triggers OTP Challenge
  const loginWithPassword = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${backendUrl}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Login challenge failed.');
      }

      if (data.requiresOtp) {
        const challenge = {
          challengeId: data.challengeId,
          email: data.email,
          devOtpHint: data.devOtpHint
        };
        setOtpChallenge(challenge);
        sessionStorage.setItem('otp_challenge', JSON.stringify(challenge));
      }
      return data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Step 1 (Alternative): Google Login -> Triggers Mandatory OTP Challenge
  const loginWithGoogle = async (email, googleToken) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${backendUrl}/api/admin/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, googleToken })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Google authorization challenge failed.');
      }

      if (data.requiresOtp) {
        const challenge = {
          challengeId: data.challengeId,
          email: data.email,
          devOtpHint: data.devOtpHint
        };
        setOtpChallenge(challenge);
        sessionStorage.setItem('otp_challenge', JSON.stringify(challenge));
      }
      return data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP -> Grants Verified Admin Session
  const verifyOtp = async (otpCode) => {
    if (!otpChallenge?.challengeId) {
      throw new Error('No active OTP challenge found. Please sign in again.');
    }
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${backendUrl}/api/admin/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: otpChallenge.challengeId,
          otp: otpCode
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'OTP verification failed.');
      }

      // Success: Save token & user
      setAdminToken(data.token);
      setAdminUser(data.admin);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.admin));

      // Clear challenge
      setOtpChallenge(null);
      sessionStorage.removeItem('otp_challenge');
      return data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (!otpChallenge?.challengeId) throw new Error('No active challenge session.');
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: otpChallenge.challengeId })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to resend code.');
      }
      if (data.devOtpHint) {
        setOtpChallenge((prev) => ({ ...prev, devOtpHint: data.devOtpHint }));
      }
      return data;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelOtp = () => {
    setOtpChallenge(null);
    sessionStorage.removeItem('otp_challenge');
    setAuthError(null);
  };

  const logout = () => {
    setAdminToken(null);
    setAdminUser(null);
    setOtpChallenge(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    sessionStorage.removeItem('otp_challenge');
  };

  const isAuthenticated = !!adminToken && !!adminUser;

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        adminToken,
        otpChallenge,
        loading,
        authError,
        setAuthError,
        loginWithPassword,
        loginWithGoogle,
        verifyOtp,
        resendOtp,
        cancelOtp,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
};
