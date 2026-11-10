import { authenticateAdmin } from '../services/adminSessions.js';

export async function protectAdmin(req, res, next) {
  try {
    req.authSession = await authenticateAdmin(req.headers.authorization);
    req.user = req.authSession.user;
    next();
  } catch (error) {
    return res.status(error.status || 503).json({ message: error.status ? error.message : 'Administrator sessions are temporarily unavailable.' });
  }
}
