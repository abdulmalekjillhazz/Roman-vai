import express from 'express';
import { getProfile, updateProfile } from '../controllers/businessProfileController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { requireCatalogDatabase } from '../middlewares/requireCatalogDatabase.js';
import { uploadMiddleware } from '../config/cloudinary.js';

const router = express.Router();

function receiveBusinessFiles(req, res, next) {
  uploadMiddleware.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'photos', maxCount: 10 },
    { name: 'certificates', maxCount: 10 },
    { name: 'companyProfilePdf', maxCount: 1 }
  ])(req, res, error => {
    if (!error) return next();
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'Each file must be 8 MB or smaller.'
      : error.message;
    return res.status(400).json({ message });
  });
}

router.get('/', getProfile);
router.put('/', protectAdmin, requireCatalogDatabase, receiveBusinessFiles, updateProfile);

export default router;
