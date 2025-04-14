
import { BlogRepository } from '../repositories/blogRepository';
import { IBlog } from '../models/blogModel';
import { uploadToCloudinary } from '../utils/cloudinary';

export class BlogService {
  private blogRepository: BlogRepository;

  constructor() {
    this.blogRepository = new BlogRepository();
  }

  async createBlog(blogData: Partial<IBlog>, imageFile: Buffer, userId: string): Promise<IBlog> {
    
    const imageUrl = await uploadToCloudinary(imageFile, 'blog-platform/blogs');
    
    
    const blog = await this.blogRepository.create({
      ...blogData,
      image: imageUrl,
      user: userId as any,
    });
    
    return blog;
  }

  async getAllBlogs(limit: number = 10, page: number = 1): Promise<{ blogs: IBlog[]; total: number; pages: number }> {
    const blogs = await this.blogRepository.findAll(limit, page);
    const total = await this.blogRepository.countTotal();
    const pages = Math.ceil(total / limit);
    
    return { blogs, total, pages };
  }

  async getBlogById(id: string): Promise<IBlog> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) {
      throw new Error('Blog not found');
    }
    return blog;
  }

  async getBlogsByUser(userId: string): Promise<IBlog[]> {
    return await this.blogRepository.findByUser(userId);
  }

  async updateBlog(id: string, userId: string, updateData: Partial<IBlog>, imageFile?: Buffer): Promise<IBlog> {
   
    if (imageFile) {
      const imageUrl = await uploadToCloudinary(imageFile, 'blog-platform/blogs');
      updateData.image = imageUrl;
    }
    
    const blog = await this.blogRepository.update(id, userId, updateData);
    if (!blog) {
      throw new Error('Blog not found or unauthorized');
    }
    return blog;
  }

  async deleteBlog(id: string, userId: string): Promise<boolean> {
    const deleted = await this.blogRepository.delete(id, userId);
    if (!deleted) {
      throw new Error('Blog not found or unauthorized');
    }
    return true;
  }
}