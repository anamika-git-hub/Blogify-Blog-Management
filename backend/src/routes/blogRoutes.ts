// src/routes/blog.routes.ts
import express from 'express';
import { BlogController } from '../controllers/blogController';
import { check } from 'express-validator';
import { protect } from '../middleware/authMiddleware';
import { uploadSingle } from '../middleware/uploadMiddleware';

const router = express.Router();
const blogController = new BlogController();

router.post(
  '/',
  protect,
  uploadSingle('image'),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
  ],
  blogController.createBlog
);

router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById)
router.get('/user/me', protect, blogController.getUserBlogs);
router.put(
  '/:id',
  protect,
  uploadSingle('image'),
  [
    check('title', 'Title is required if provided').optional().not().isEmpty(),
    check('content', 'Content is required if provided').optional().not().isEmpty(),
  ],
  blogController.updateBlog
);
router.delete('/:id', protect, blogController.deleteBlog);

export default router;