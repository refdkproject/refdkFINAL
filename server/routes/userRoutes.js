import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { uploadProfilePic, uploadInstitutionLogo } from '../middleware/uploadMiddleware.js';
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  uploadProfilePicHandler,
  uploadInstitutionLogoHandler,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').post(registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

router.route('/profile-pic').post(protect, uploadProfilePic, uploadProfilePicHandler);

router.route('/institution-logo').post(protect, uploadInstitutionLogo, uploadInstitutionLogoHandler);

export default router;
