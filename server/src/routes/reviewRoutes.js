import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  submitReview,
  getReviews,
  updateReviewStatus,
  deleteReview
} from '../controllers/reviewController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { requireCatalogDatabase } from '../middlewares/requireCatalogDatabase.js';
import { uploadMiddleware } from '../config/cloudinary.js';

const router = express.Router();

const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { message: 'Too many review submissions from this IP. Please try again later.' }
});

function receiveReviewFiles(req, res, next) {
  uploadMiddleware.array('images', 5)(req, res, error => {
    if (!error) return next();
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'Each image must be 8 MB or smaller.'
      : ['LIMIT_FILE_COUNT', 'LIMIT_UNEXPECTED_FILE'].includes(error.code)
      ? 'Upload a maximum of 5 images at a time.'
      : error.message;
    return res.status(400).json({ message });
  });
}

router.post('/', reviewLimiter, receiveReviewFiles, submitReview);
router.get('/', (req, res, next) => req.query.all === 'true' ? protectAdmin(req, res, next) : next(), getReviews);
router.put('/:id', protectAdmin, requireCatalogDatabase, updateReviewStatus);
router.delete('/:id', protectAdmin, requireCatalogDatabase, deleteReview);

export default router;
