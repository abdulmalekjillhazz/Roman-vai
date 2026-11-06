import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { requireCatalogDatabase } from '../middlewares/requireCatalogDatabase.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protectAdmin, requireCatalogDatabase, createCategory);
router.put('/:id', protectAdmin, requireCatalogDatabase, updateCategory);
router.delete('/:id', protectAdmin, requireCatalogDatabase, deleteCategory);

export default router;
