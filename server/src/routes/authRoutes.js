import express from 'express';
import rateLimit from 'express-rate-limit';
import { loginAdmin, logoutAdmin } from '../controllers/authController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.'
  }
});

router.post('/login', authLimiter, loginAdmin);
router.post('/logout', protectAdmin, logoutAdmin);

export default router;
