import mongoose from 'mongoose';
import { ensureDBConnected } from '../config/db.js';

export async function requireCatalogDatabase(req, res, next) {
  let connected;
  try { connected = await ensureDBConnected(); }
  catch { connected = false; }
  if (!connected || mongoose.connection.readyState !== 1) {
    res.status(503).json({
      message: 'Catalog is read-only. Connect MongoDB before saving or deleting catalog content.'
    });
    return false;
  }
  if (next) next();
  return true;
}
