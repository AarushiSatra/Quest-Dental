import { Router } from 'express';
import {
  signup,
  login,
  googleAuth,
  me,
  updateProfile,
  requestEmailChangeOtp,
  changeEmail,
  requestPasswordChangeOtp,
  changePassword,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', requireAuth, me);
router.patch('/me', requireAuth, updateProfile);
router.post('/change-email/request-otp', requireAuth, requestEmailChangeOtp);
router.patch('/change-email', requireAuth, changeEmail);
router.post('/change-password/request-otp', requireAuth, requestPasswordChangeOtp);
router.patch('/change-password', requireAuth, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;