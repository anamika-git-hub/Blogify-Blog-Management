import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BlogForm from '../components/blogs/blogForm';
import { createBlog } from '../services/blogService';
import { useAuth } from '../context/authContext';

const CreateBlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: { title: string; content: string }, image: File | null) => {
    if (!image) {
      toast.error('Please upload an image for your blog');
      return;
    }

    if (!token) {
      toast.error('Authentication error. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createBlog(values, image, token);
      toast.success('Blog created successfully!');
      navigate('/my-blogs');
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error('Failed to create blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold mb-6">Create New Blog</h1>
      <BlogForm
        initialValues={{ title: '', content: '' }}
        onSubmit={handleSubmit}
        buttonText={isSubmitting ? 'Creating...' : 'Create Blog'}
      />
    </div>
  );
};

export default CreateBlogPage;