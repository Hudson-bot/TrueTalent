import express from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe
} from '../controllers/authController.js';
import { protect, authorize } from './../middleware/auth.js';

const router = express.Router();

router.post('/signup', register);
router.post('/register', register); 
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);

export default router;
