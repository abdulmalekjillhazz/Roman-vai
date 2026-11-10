import express from 'express';
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';
import { requireCatalogDatabase } from '../middlewares/requireCatalogDatabase.js';
import { uploadMiddleware } from '../config/cloudinary.js';

const router = express.Router();

function receiveImages(req, res, next) {
  uploadMiddleware.array('images', 12)(req, res, error => {
    if (!error) return next();
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'Each image must be 8 MB or smaller.'
      : ['LIMIT_FILE_COUNT', 'LIMIT_UNEXPECTED_FILE'].includes(error.code)
      ? 'Upload a maximum of 12 images at a time.'
      : error.message;
    return res.status(400).json({ message });
  });
}

router.get('/', (req, res, next) => req.query.all === 'true' ? protectAdmin(req, res, next) : next(), getProjects);
router.get('/:slug', getProjectBySlug);
router.post('/', protectAdmin, requireCatalogDatabase, receiveImages, createProject);
router.put('/:id', protectAdmin, requireCatalogDatabase, receiveImages, updateProject);
router.delete('/:id', protectAdmin, requireCatalogDatabase, deleteProject);

export default router;
