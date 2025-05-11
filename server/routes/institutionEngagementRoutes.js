import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAllInstitutionEngagements } from '../controllers/institutionEngagementController.js';

const router = express.Router();

router.get("/", protect, getAllInstitutionEngagements);

export default router;
