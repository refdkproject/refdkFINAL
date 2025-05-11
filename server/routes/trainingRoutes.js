import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getTrainings } from '../controllers/trainingController.js';

const router = express.Router();

router.get("/", protect, getTrainings);

export default router;
