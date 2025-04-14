import express from 'express';
import { UserController } from '../controllers/userController';
import { check } from 'express-validator';
import { protect } from '../middleware/authMiddleware';
import { uploadSingle } from '../middleware/uploadMiddleware';

const router = express.Router();
const userController = new UserController();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  userController.register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  userController.login
);

router.get('/me', protect, userController.getProfile);

router.put(
  '/me',
  protect,
  uploadSingle('avatar'),
  [check('name', 'Name is required if provided').optional().not().isEmpty()],
  userController.updateProfile
);

export default router;