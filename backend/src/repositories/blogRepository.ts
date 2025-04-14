
import { Blog, IBlog } from '../models/blogModel';
import mongoose from 'mongoose';

export class BlogRepository {
  async create(blogData: Partial<IBlog>): Promise<IBlog> {
    return await Blog.create(blogData);
  }

  async findById(id: string): Promise<IBlog | null> {
    return await Blog.findById(id).populate('user', 'name email avatar');
  }

  async findAll(limit: number = 10, page: number = 1): Promise<IBlog[]> {
    const skip = (page - 1) * limit;
    return await Blog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'name email avatar');
  }

  async findByUser(userId: string): Promise<IBlog[]> {
    return await Blog.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email avatar');
  }

  async update(id: string, userId: string, updateData: Partial<IBlog>): Promise<IBlog | null> {
    return await Blog.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email avatar');
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await Blog.findOneAndDelete({ _id: id, user: userId });
    return !!result;
  }

  async countTotal(): Promise<number> {
    return await Blog.countDocuments();
  }
}