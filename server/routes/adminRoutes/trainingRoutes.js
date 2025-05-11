import express from 'express';
import { protect, checkRole } from '../../middleware/authMiddleware.js';
import { uploadVideo } from '../../middleware/uploadMiddleware.js';
import {
  createTraining,
  deleteTraining,
  getTrainingById,
  getTrainingByOrgId,
  getTrainings,
  updateTraining,
} from '../../controllers/trainingController.js';

const router = express.Router();

/* Event Routes */
router.get('/:id', protect, checkRole(['admin', 'charity_admin']), getTrainingByOrgId);

router.get('/single/:id', protect, checkRole(['admin', 'charity_admin']), getTrainingById);

router.post('/', protect, checkRole(['admin', 'charity_admin']), uploadVideo, createTraining);

router.put('/:id', protect, checkRole(['admin', 'charity_admin']), uploadVideo, updateTraining);

router.delete('/:id', protect, checkRole(['admin', 'charity_admin']), deleteTraining);

export default router;
