import express from 'express';
import { getHeroSlides, updateHeroSlide } from '../controllers/heroSlideController.js';
import { uploadMiddleware } from '../config/cloudinary.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { requireCatalogDatabase } from '../middlewares/requireCatalogDatabase.js';

const router = express.Router();

router.get('/', getHeroSlides);
router.post('/:key', protectAdmin, requireCatalogDatabase, receiveHeroImage, updateHeroSlide);
router.put('/:key', protectAdmin, requireCatalogDatabase, receiveHeroImage, updateHeroSlide);

function receiveHeroImage(req, res, next) {
  uploadMiddleware.single('image')(req, res, error => {
    if (!error) return next();
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'The image must be 8 MB or smaller.'
      : error.message;
    return res.status(400).json({ message });
  });
}

export default router;
