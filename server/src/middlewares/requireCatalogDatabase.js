import mongoose from 'mongoose';
import { ensureDBConnected } from '../config/db.js';

export async function requireCatalogDatabase(req, res, next) {
  const connected = await ensureDBConnected();
  if (!connected || mongoose.connection.readyState !== 1) {
    res.status(503).json({
      message: 'Catalog is read-only. Connect MongoDB before saving or deleting products and categories.'
    });
    return false;
  }
  if (next) next();
  return true;
}
