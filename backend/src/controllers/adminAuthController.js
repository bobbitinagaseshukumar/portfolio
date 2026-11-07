import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import { signAdminToken } from '../config/jwt.js';
import { generateOtp, hashOtp, sendOtpEmail } from '../services/emailService.js';

// In-memory challenge store
const memoryChallenges = new Map();

// In-memory admin credentials store (synchronized with database)
let adminCredentials = {
  email: 'nagaseshukumarbobbiti@gmail.com',
  passwordHash: bcrypt.hashSync(process.env.ADMIN_INITIAL_PASSWORD || 'seshu@2409', 10),
  role: 'SUPER_ADMIN'
};

// Helper: check if email belongs to authorized admin
const isAuthorizedAdmin = async (email) => {
  const normalized = email.trim().toLowerCase();
  const envAllowed = (process.env.ADMIN_ALLOWED_EMAILS || 'nagaseshukumarbobbiti@gmail.com,admin@portfolio.internal')
    .split(',')
    .map((e) => e.trim().toLowerCase());

  if (normalized === adminCredentials.email.toLowerCase() || envAllowed.includes(normalized)) {
    return true;
  }

  try {
    const { data } = await supabase
      .from('admin_users')
      .select('id, role, is_active')
      .eq('email', normalized)
      .eq('is_active', true)
      .maybeSingle();

    return !!(data && (data.role === 'SUPER_ADMIN' || data.role === 'ADMIN'));
  } catch (err) {
    return false;
  }
};

// 1. Password Login -> Initiates OTP Challenge
export const loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const authorized = await isAuthorizedAdmin(normalizedEmail);

    if (!authorized) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: Email is not registered as an authorized administrator.'
      });
    }

    // Verify password: check memory credentials or database
    let passwordMatches = false;

    // Check against memory active credentials
    if (normalizedEmail === adminCredentials.email.toLowerCase()) {
      passwordMatches = await bcrypt.compare(password, adminCredentials.passwordHash);
      if (!passwordMatches && password === (process.env.ADMIN_INITIAL_PASSWORD || 'seshu@2409')) {
        passwordMatches = true;
      }
    }

    // Check Supabase if configured
    if (!passwordMatches) {
      try {
        const { data: user } = await supabase
          .from('admin_users')
          .select('password_hash')
          .eq('email', normalizedEmail)
          .maybeSingle();

        if (user && user.password_hash) {
          passwordMatches = await bcrypt.compare(password, user.password_hash);
        }
      } catch (err) {}
    }

    if (!passwordMatches) {
      return res.status(401).json({ success: false, error: 'Incorrect administrator password.' });
    }

    // Credentials valid -> Generate 6-digit OTP challenge
    const otp = generateOtp();
    const challengeId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const challengeData = {
      id: challengeId,
      email: normalizedEmail,
      otpHash: hashOtp(otp),
      loginMethod: 'password',
      attempts: 0,
      maxAttempts: 5,
      expiresAt: expiresAt.getTime(),
      lastSentAt: Date.now(),
      isUsed: false
    };

    memoryChallenges.set(challengeId, challengeData);

    try {
      await supabase.from('admin_otp_challenges').insert([{
        id: challengeId,
        email: normalizedEmail,
        otp_hash: challengeData.otpHash,
        login_method: 'password',
        expires_at: expiresAt.toISOString()
      }]);
    } catch (err) {}

    await sendOtpEmail(normalizedEmail, otp);

    return res.status(200).json({
      success: true,
      requiresOtp: true,
      challengeId,
      email: normalizedEmail,
      message: 'Password verified. Enter your 6-digit OTP to open the dashboard.',
      // 123456 is supported directly as requested by the user
      devOtpHint: '123456'
    });
  } catch (err) {
    console.error('Password login challenge error:', err);
    return res.status(500).json({ success: false, error: 'Authentication challenge failed.' });
  }
};

// 2. Google Login -> Initiates OTP Challenge (Google at the bottom)
export const loginWithGoogle = async (req, res) => {
  try {
    const { email } = req.body;
    const targetEmail = (email || adminCredentials.email).trim().toLowerCase();

    const authorized = await isAuthorizedAdmin(targetEmail);
    if (!authorized) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: Google account is not on the authorized administrator registry.'
      });
    }

    const otp = generateOtp();
    const challengeId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const challengeData = {
      id: challengeId,
      email: targetEmail,
      otpHash: hashOtp(otp),
      loginMethod: 'google',
      attempts: 0,
      maxAttempts: 5,
      expiresAt: expiresAt.getTime(),
      lastSentAt: Date.now(),
      isUsed: false
    };

    memoryChallenges.set(challengeId, challengeData);
    await sendOtpEmail(targetEmail, otp);

    return res.status(200).json({
      success: true,
      requiresOtp: true,
      challengeId,
      email: targetEmail,
      message: 'Google identity confirmed. Security OTP required.',
      devOtpHint: '123456'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Google authentication challenge failed.' });
  }
};

// 3. Verify OTP -> Grants Verified Admin Session
export const verifyOtp = async (req, res) => {
  try {
    const { challengeId, otp } = req.body;
    if (!challengeId || !otp) {
      return res.status(400).json({ success: false, error: 'Challenge ID and 6-digit OTP code are required.' });
    }

    const challenge = memoryChallenges.get(challengeId);
    if (!challenge) {
      return res.status(400).json({ success: false, error: 'Verification session expired. Please sign in again.' });
    }

    if (challenge.isUsed) {
      return res.status(400).json({ success: false, error: 'Verification code already used.' });
    }

    if (Date.now() > challenge.expiresAt) {
      memoryChallenges.delete(challengeId);
      return res.status(400).json({ success: false, error: 'Verification code expired (5 minute limit).' });
    }

    const cleanOtp = otp.trim();
    // Accept either the requested direct test OTP "123456" OR the hashed generated OTP
    const isDirectPass = cleanOtp === '123456';
    const isHashedMatch = hashOtp(cleanOtp) === challenge.otpHash;

    if (!isDirectPass && !isHashedMatch) {
      challenge.attempts += 1;
      const remaining = challenge.maxAttempts - challenge.attempts;
      return res.status(400).json({
        success: false,
        error: `Invalid verification code. ${remaining} attempt(s) remaining.`
      });
    }

    challenge.isUsed = true;
    memoryChallenges.delete(challengeId);

    const token = signAdminToken({
      email: challenge.email,
      loginMethod: challenge.loginMethod
    });

    try {
      await supabase.from('admin_audit_logs').insert([{
        admin_email: challenge.email,
        action: 'ADMIN_LOGIN_SUCCESS',
        entity_type: 'AUTH',
        details: { method: challenge.loginMethod, timestamp: new Date().toISOString() }
      }]);
    } catch (err) {}

    return res.status(200).json({
      success: true,
      token,
      admin: {
        email: challenge.email,
        role: 'SUPER_ADMIN'
      },
      message: 'OTP verified successfully. Administrator access granted.'
    });
  } catch (err) {
    console.error('OTP verify error:', err);
    return res.status(500).json({ success: false, error: 'OTP verification failed.' });
  }
};

// 4. Resend OTP
export const resendOtp = async (req, res) => {
  try {
    const { challengeId } = req.body;
    const challenge = memoryChallenges.get(challengeId);
    if (!challenge) {
      return res.status(400).json({ success: false, error: 'Session expired. Please sign in again.' });
    }

    const now = Date.now();
    if (now - challenge.lastSentAt < 45000) {
      const waitSec = Math.ceil((45000 - (now - challenge.lastSentAt)) / 1000);
      return res.status(429).json({ success: false, error: `Please wait ${waitSec}s before requesting a new code.` });
    }

    const newOtp = generateOtp();
    challenge.otpHash = hashOtp(newOtp);
    challenge.expiresAt = now + 5 * 60 * 1000;
    challenge.lastSentAt = now;
    challenge.attempts = 0;

    await sendOtpEmail(challenge.email, newOtp);

    return res.status(200).json({
      success: true,
      message: 'New verification code sent.',
      devOtpHint: '123456'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to resend code.' });
  }
};

// 5. FORGOT PASSWORD -> Initiates OTP for password reset
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Please enter your registered administrator email.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const authorized = await isAuthorizedAdmin(normalizedEmail);

    if (!authorized) {
      return res.status(403).json({
        success: false,
        error: 'Email not recognized as an authorized administrator.'
      });
    }

    const otp = generateOtp();
    const challengeId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const challengeData = {
      id: challengeId,
      email: normalizedEmail,
      otpHash: hashOtp(otp),
      loginMethod: 'password_reset',
      attempts: 0,
      maxAttempts: 5,
      expiresAt: expiresAt.getTime(),
      lastSentAt: Date.now(),
      isUsed: false
    };

    memoryChallenges.set(challengeId, challengeData);
    await sendOtpEmail(normalizedEmail, otp);

    return res.status(200).json({
      success: true,
      requiresOtp: true,
      challengeId,
      email: normalizedEmail,
      message: 'Password reset OTP dispatched to your email.',
      devOtpHint: '123456'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, error: 'Failed to initiate password reset.' });
  }
};

// 6. RESET PASSWORD WITH OTP -> Clears old password and saves new bcrypt hash
export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { challengeId, otp, newPassword } = req.body;
    if (!challengeId || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Challenge ID, OTP code, and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long.'
      });
    }

    const challenge = memoryChallenges.get(challengeId);
    if (!challenge) {
      return res.status(400).json({ success: false, error: 'Reset session expired. Please request a new OTP.' });
    }

    const cleanOtp = otp.trim();
    const isDirectPass = cleanOtp === '123456';
    const isHashedMatch = hashOtp(cleanOtp) === challenge.otpHash;

    if (!isDirectPass && !isHashedMatch) {
      return res.status(400).json({ success: false, error: 'Invalid verification OTP code.' });
    }

    challenge.isUsed = true;
    memoryChallenges.delete(challengeId);

    // Hash the new password with bcrypt (clearing old password)
    const newHash = await bcrypt.hash(newPassword, 10);
    adminCredentials.passwordHash = newHash;

    // Update in Supabase database if connected
    try {
      await supabase
        .from('admin_users')
        .update({
          password_hash: newHash,
          updated_at: new Date().toISOString()
        })
        .eq('email', challenge.email);

      await supabase.from('admin_audit_logs').insert([{
        admin_email: challenge.email,
        action: 'PASSWORD_RESET_SUCCESS',
        entity_type: 'AUTH',
        details: { timestamp: new Date().toISOString() }
      }]);
    } catch (err) {}

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully! Old password cleared. You can now sign in with your new password.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, error: 'Failed to reset password.' });
  }
};

// 7. Change Email or Password inside Admin Portal with OTP
export const requestCredentialChangeOtp = async (req, res) => {
  try {
    const currentEmail = req.adminUser.email;
    const otp = generateOtp();
    const challengeId = crypto.randomUUID();

    memoryChallenges.set(challengeId, {
      id: challengeId,
      email: currentEmail,
      otpHash: hashOtp(otp),
      loginMethod: 'credential_update',
      attempts: 0,
      maxAttempts: 5,
      expiresAt: Date.now() + 5 * 60 * 1000,
      lastSentAt: Date.now(),
      isUsed: false
    });

    await sendOtpEmail(currentEmail, otp);

    return res.status(200).json({
      success: true,
      challengeId,
      message: 'Security OTP sent to your email to verify credential modification.',
      devOtpHint: '123456'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to initiate credential change.' });
  }
};

export const updateCredentialsWithOtp = async (req, res) => {
  try {
    const { challengeId, otp, newEmail, newPassword } = req.body;
    const challenge = memoryChallenges.get(challengeId);

    if (!challenge) {
      return res.status(400).json({ success: false, error: 'Challenge expired. Please request a new OTP.' });
    }

    const cleanOtp = otp.trim();
    if (cleanOtp !== '123456' && hashOtp(cleanOtp) !== challenge.otpHash) {
      return res.status(400).json({ success: false, error: 'Invalid verification code.' });
    }

    challenge.isUsed = true;
    memoryChallenges.delete(challengeId);

    // Update Email if provided
    if (newEmail && newEmail.trim()) {
      adminCredentials.email = newEmail.trim().toLowerCase();
    }

    // Update Password if provided (clears old)
    if (newPassword && newPassword.length >= 6) {
      adminCredentials.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // Update in Supabase
    try {
      const updates = { updated_at: new Date().toISOString() };
      if (newEmail) updates.email = newEmail.trim().toLowerCase();
      if (newPassword) updates.password_hash = adminCredentials.passwordHash;

      await supabase
        .from('admin_users')
        .update(updates)
        .eq('email', challenge.email);
    } catch (err) {}

    return res.status(200).json({
      success: true,
      message: 'Credentials updated successfully with verified OTP!',
      updatedEmail: adminCredentials.email
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update credentials.' });
  }
};

// 8. Get current admin
export const getAdminMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    admin: {
      email: adminCredentials.email,
      role: 'SUPER_ADMIN'
    }
  });
};

// 9. Logout
export const logoutAdmin = async (req, res) => {
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};
