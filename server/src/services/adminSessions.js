import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { AdminSession } from '../models/AdminSession.js';
import { User } from '../models/User.js';
import { ensureDBConnected, isDatabaseConfigured } from '../config/db.js';

const issuer = 'classicaldecorid-admin';
const audience = 'classicaldecorid-admin';
const lifetimeSeconds = 60 * 60;
// Bootstrap mode is deliberately local to one server process and disabled when
// a real database URI is configured. Production sessions live in MongoDB.
const bootstrapSessions = new Map();
const hashId = id => crypto.createHash('sha256').update(id).digest('hex');
const authError = (status, message) => Object.assign(new Error(message), { status });

function secret() {
  if (!process.env.JWT_SECRET) throw authError(503, 'Administrator sign-in is temporarily unavailable.');
  return process.env.JWT_SECRET;
}

function pruneBootstrapSessions() {
  for (const [id, expiresAt] of bootstrapSessions) {
    if (expiresAt <= Date.now()) bootstrapSessions.delete(id);
  }
}

export async function createAdminSession(user, bootstrap = false) {
  const signingSecret = secret();
  const sessionId = crypto.randomUUID();
  const sessionIdHash = hashId(sessionId);
  const expiresAt = new Date(Date.now() + lifetimeSeconds * 1000);
  const token = jwt.sign({
    ...(bootstrap ? {} : { id: String(user._id) }),
    email: user.email,
    role: 'admin',
    authSource: bootstrap ? 'bootstrap' : 'database'
  }, signingSecret, {
    algorithm: 'HS256', expiresIn: lifetimeSeconds, issuer, audience, jwtid: sessionId
  });
  if (bootstrap) {
    pruneBootstrapSessions();
    bootstrapSessions.set(sessionIdHash, expiresAt.getTime());
  } else {
    await AdminSession.create({ sessionIdHash, userId: user._id, expiresAt });
  }
  return token;
}

export async function authenticateAdmin(authHeader) {
  if (typeof authHeader !== 'string' || !/^Bearer \S+$/i.test(authHeader)) {
    throw authError(401, 'Unauthorized: Missing or invalid token');
  }
  const signingSecret = secret();
  let user;
  try {
    user = jwt.verify(authHeader.slice(7), signingSecret, {
      algorithms: ['HS256'], issuer, audience, maxAge: lifetimeSeconds
    });
  } catch {
    throw authError(401, 'Unauthorized: Invalid or expired token');
  }
  if (!user || user.role !== 'admin') throw authError(403, 'Forbidden: Admin access required');
  if (typeof user.jti !== 'string') throw authError(401, 'Unauthorized: Session is no longer valid');
  const sessionIdHash = hashId(user.jti);
  if (user.authSource === 'bootstrap') {
    pruneBootstrapSessions();
    if (isDatabaseConfigured() || !bootstrapSessions.has(sessionIdHash)) {
      throw authError(401, 'Unauthorized: Session is no longer valid');
    }
  } else if (user.authSource === 'database' && mongoose.isValidObjectId(user.id)) {
    if (!(await ensureDBConnected())) throw authError(503, 'Administrator sessions are temporarily unavailable.');
    const session = await AdminSession.findOne({ sessionIdHash, userId: user.id, expiresAt: { $gt: new Date() } }).lean();
    if (!session) throw authError(401, 'Unauthorized: Session is no longer valid');
    const account = await User.findById(user.id).select('role').lean();
    if (!account || account.role !== 'admin') throw authError(403, 'Forbidden: Admin access required');
  } else {
    throw authError(401, 'Unauthorized: Session is no longer valid');
  }
  return { user, sessionIdHash };
}

export async function revokeAdminSession({ user, sessionIdHash }) {
  if (user.authSource === 'bootstrap') bootstrapSessions.delete(sessionIdHash);
  else await AdminSession.deleteOne({ sessionIdHash, userId: user.id });
}
