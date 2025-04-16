import axios from 'axios';
import { Blog, ApiResponse } from '../types';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/blogs` || 'http://localhost:5000/api/blogs';

// Set up axios with token
const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Get all blogs
export const getAllBlogs = async (page = 1, limit = 9): Promise<{ blogs: Blog[]; total: number; pages: number }> => {
  try {
    const response = await axios.get<ApiResponse<{ blogs: Blog[]; total: number; pages: number }>>(
      `${API_URL}?page=${page}&limit=${limit}`
    );
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch blogs');
  }
};

// Get blog by ID
export const getBlogById = async (id: string): Promise<Blog> => {
  try {
    const response = await axios.get<ApiResponse<Blog>>(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch blog');
  }
};

// Get user blogs
export const getUserBlogs = async (token: string): Promise<Blog[]> => {
  try {
    setAuthToken(token);
    const response = await axios.get<ApiResponse<Blog[]>>(`${API_URL}/user/me`);
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch user blogs');
  }
};

// Create blog
export const createBlog = async (blogData: { title: string; content: string }, image: File, token: string): Promise<Blog> => {
  try {
    setAuthToken(token);
    
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('content', blogData.content);
    formData.append('image', image);

    const response = await axios.post<ApiResponse<Blog>>(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to create blog');
  }
};

// Update blog
export const updateBlog = async (
  id: string,
  blogData: { title?: string; content?: string },
  image: File | null,
  token: string
): Promise<Blog> => {
  try {
    setAuthToken(token);
    
    const formData = new FormData();
    if (blogData.title) formData.append('title', blogData.title);
    if (blogData.content) formData.append('content', blogData.content);
    if (image) formData.append('image', image);

    const response = await axios.put<ApiResponse<Blog>>(`${API_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to update blog');
  }
};

// Delete blog
export const deleteBlog = async (id: string, token: string): Promise<void> => {
  try {
    setAuthToken(token);
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error('Failed to delete blog');
  }
};