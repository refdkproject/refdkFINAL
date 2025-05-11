import express from 'express';
import { sendMailController } from '../controllers/emailController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send', protect, admin, sendMailController);

export default router;
