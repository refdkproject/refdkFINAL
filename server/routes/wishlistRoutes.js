import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getWishListItems } from '../controllers/wishlistController.js';

const router = express.Router();

router.get("/", protect, getWishListItems);

export default router;
