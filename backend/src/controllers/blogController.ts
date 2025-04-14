import { Request, Response } from 'express';
import { BlogService } from '../services/blogService';
import { validationResult } from 'express-validator';

export class BlogController {
  private blogService: BlogService;

  constructor() {
    this.blogService = new BlogService();
  }

  createBlog = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'Please upload an image',
        });
        return;
      }

      const { title, content } = req.body;
      const userId = req.user._id;
      const imageFile = req.file.buffer;

      const blog = await this.blogService.createBlog(
        { title, content },
        imageFile,
        userId
      );

      res.status(201).json({
        success: true,
        data: blog,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getAllBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const blogs = await this.blogService.getAllBlogs(limit, page);

      res.status(200).json({
        success: true,
        data: blogs,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getBlogById = async (req: Request, res: Response): Promise<void> => {
    try {
      const blog = await this.blogService.getBlogById(req.params.id);

      res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };

  getUserBlogs = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user._id;
      const blogs = await this.blogService.getBlogsByUser(userId);

      res.status(200).json({
        success: true,
        data: blogs,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  updateBlog = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
      }

      const { title, content } = req.body;
      const blogId = req.params.id;
      const userId = req.user._id;
      
      const imageFile = req.file ? req.file.buffer : undefined;

      const blog = await this.blogService.updateBlog(
        blogId,
        userId,
        { title, content },
        imageFile
      );

      res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  deleteBlog = async (req: Request, res: Response): Promise<void> => {
    try {
      const blogId = req.params.id;
      const userId = req.user._id;

      await this.blogService.deleteBlog(blogId, userId);

      res.status(200).json({
        success: true,
        data: {},
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
    });
}
};

}