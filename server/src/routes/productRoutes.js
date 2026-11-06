import express from 'express';
import {
  getProducts,
  getCatalogStatus,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { uploadMiddleware } from '../config/cloudinary.js';
import { requireCatalogDatabase } from '../middlewares/requireCatalogDatabase.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/admin/status', protectAdmin, getCatalogStatus);
router.get('/:slug', getProductBySlug);
function receiveImages(req, res, next) {
  uploadMiddleware.array('images', 12)(req, res, error => {
    if (!error) return next();
    const message = error.code === 'LIMIT_FILE_SIZE' ? 'Each image must be 8 MB or smaller.'
      : ['LIMIT_FILE_COUNT', 'LIMIT_UNEXPECTED_FILE'].includes(error.code) ? 'Upload a maximum of 12 images at a time.' : error.message;
    return res.status(400).json({ message });
  });
}
router.post('/', protectAdmin, requireCatalogDatabase, receiveImages, createProduct);
router.put('/:id', protectAdmin, requireCatalogDatabase, receiveImages, updateProduct);
router.delete('/:id', protectAdmin, requireCatalogDatabase, deleteProduct);

export default router;
