import crypto from 'crypto';
import { User } from '../models/User.js';
import { ensureDBConnected, isDatabaseConfigured } from '../config/db.js';
import { createAdminSession, revokeAdminSession } from '../services/adminSessions.js';

function timingSafeEqualStrings(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Valid email and password are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!process.env.JWT_SECRET) {
      return res.status(503).json({ message: 'Administrator sign-in is temporarily unavailable.' });
    }

    if (await ensureDBConnected()) {
      const user = await User.findOne({ email: trimmedEmail }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      if (user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admin access required' });
      const token = await createAdminSession(user);
      return res.json({ token, email: user.email });
    }

    if (isDatabaseConfigured()) {
      return res.status(503).json({ message: 'Administrator sign-in is temporarily unavailable.' });
    }

    // Fallback check against .env ADMIN_EMAIL / ADMIN_PASSWORD if DB not connected (timing-safe)
    const envEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : '';
    const envPass = process.env.ADMIN_PASSWORD || '';

    if (
      envEmail &&
      envPass &&
      timingSafeEqualStrings(trimmedEmail, envEmail) &&
      timingSafeEqualStrings(password, envPass) &&
      process.env.JWT_SECRET
    ) {
      const token = await createAdminSession({ email: trimmedEmail }, true);
      return res.json({ token, email: trimmedEmail });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Authentication error:', error.message);
    const message = process.env.NODE_ENV === 'production'
      ? 'An error occurred during authentication.'
      : error.message;
    return res.status(error.status || 500).json({ message: error.status ? error.message : message });
  }
}

export async function logoutAdmin(req, res) {
  try {
    await revokeAdminSession(req.authSession);
    return res.json({ message: 'Signed out successfully.' });
  } catch {
    return res.status(503).json({ message: 'Could not invalidate this session. Please try signing out again.' });
  }
}
