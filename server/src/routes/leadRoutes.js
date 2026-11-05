import express from 'express';
import rateLimit from 'express-rate-limit';
import { submitLead } from '../controllers/leadController.js';

const router = express.Router();

const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: { status: 'error', message: 'Too many inquiries from this IP, please try again later.' }
});

router.post('/', leadLimiter, submitLead);

export default router;
