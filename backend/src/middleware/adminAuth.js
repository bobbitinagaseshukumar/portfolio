import { verifyAdminToken } from '../config/jwt.js';
import { supabase } from '../config/supabase.js';

export const requireAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing or invalid administrator token.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAdminToken(token);

    if (!decoded || !decoded.otp_verified) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Session invalid or OTP verification required.'
      });
    }

    // Verify admin is active in database (if Supabase is configured)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', decoded.email)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !adminUser) {
        // Fallback for primary configured admin email from environment
        const allowedEmails = (process.env.ADMIN_ALLOWED_EMAILS || 'admin@portfolio.internal,kumar@example.com')
          .split(',')
          .map((e) => e.trim().toLowerCase());

        if (!allowedEmails.includes(decoded.email.toLowerCase())) {
          return res.status(403).json({
            success: false,
            error: 'Forbidden: Administrator account not authorized or revoked.'
          });
        }
      }
    }

    req.adminUser = decoded;
    next();
  } catch (err) {
    console.error('Admin Auth Middleware Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal authorization error.'
    });
  }
};
