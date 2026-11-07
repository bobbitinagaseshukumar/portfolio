import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || process.env.JWT_SECRET || 'portfolio_admin_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = '8h';

export const signAdminToken = (payload) => {
  return jwt.sign(
    {
      ...payload,
      role: 'SUPER_ADMIN',
      otp_verified: true
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyAdminToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
