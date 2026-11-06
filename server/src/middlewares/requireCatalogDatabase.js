import mongoose from 'mongoose';

export function requireCatalogDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      message: 'Catalog is read-only. Connect MongoDB before saving or deleting products and categories.'
    });
    return false;
  }
  if (next) next();
  return true;
}
