import express from 'express';
import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  reorderFAQs
} from '../controllers/faqController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { requireCatalogDatabase } from '../middlewares/requireCatalogDatabase.js';

const router = express.Router();

router.get('/', (req, res, next) => req.query.all === 'true' ? protectAdmin(req, res, next) : next(), getFAQs);
router.post('/', protectAdmin, requireCatalogDatabase, createFAQ);
router.put('/reorder', protectAdmin, requireCatalogDatabase, reorderFAQs);
router.put('/:id', protectAdmin, requireCatalogDatabase, updateFAQ);
router.delete('/:id', protectAdmin, requireCatalogDatabase, deleteFAQ);

export default router;
