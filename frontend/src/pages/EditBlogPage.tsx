import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BlogForm from '../components/blogs/blogForm';
import { getBlogById, updateBlog } from '../services/blogService';
import { useAuth } from '../context/authContext';
import { Blog } from '../types';

const EditBlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const data = await getBlogById(id);
        
        // Check if the blog belongs to the current user
        if (typeof data.user === 'object' && data.user._id !== user?._id) {
          toast.error('You are not authorized to edit this blog');
          navigate('/my-blogs');
          return;
        }
        
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Failed to load blog. Please try again later.');
        navigate('/my-blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate, user?._id]);

  const handleSubmit = async (values: { title: string; content: string }, image: File | null) => {
    if (!id || !token) return;

    setIsSubmitting(true);
    try {
      await updateBlog(id, values, image, token);
      toast.success('Blog updated successfully!');
      navigate('/my-blogs');
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-700">Blog not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>
      <BlogForm
        initialValues={{ title: blog.title, content: blog.content }}
        onSubmit={handleSubmit}
        buttonText={isSubmitting ? 'Updating...' : 'Update Blog'}
        existingImage={blog.image}
      />
    </div>
  );
};

export default EditBlogPage;