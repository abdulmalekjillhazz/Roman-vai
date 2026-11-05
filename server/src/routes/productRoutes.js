import express from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { uploadMiddleware } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', protectAdmin, uploadMiddleware.array('images', 5), createProduct);
router.put('/:id', protectAdmin, uploadMiddleware.array('images', 5), updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;
