import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import { getBlogById, deleteBlog } from '../services/blogService';
import { Blog } from '../types';
import { useAuth } from '../context/authContext';
import { formatDate } from '../utils/formatDate';

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const data = await getBlogById(id);
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Failed to load blog. Please try again later.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const handleDeleteBlog = async () => {
    if (!id || !token) return;
    
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteBlog(id, token);
      toast.success('Blog deleted successfully');
      navigate('/my-blogs');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog. Please try again later.');
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
        <Link to="/" className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  const isOwner = typeof blog.user === 'object' && blog.user._id === user?._id;
  const authorName = typeof blog.user === 'object' ? blog.user.name : 'Unknown';
  const authorAvatar = typeof blog.user === 'object' ? blog.user.avatar : null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-80 relative">
          <img 
            src={blog.image || '/placeholder-image.jpg'} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Actions for blog owner */}
          {isOwner && (
            <div className="absolute top-4 right-4 flex space-x-2">
              <Link
                to={`/edit-blog/${blog._id}`}
                className="p-2 bg-white text-green-600 rounded-full shadow hover:bg-green-100 transition"
              >
                <FaEdit />
              </Link>
              <button
                onClick={handleDeleteBlog}
                className="p-2 bg-white text-red-600 rounded-full shadow hover:bg-red-100 transition"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
          
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex justify-center items-center mr-3">
              {authorAvatar ? (
                <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-gray-400" />
              )}
            </div>
            <div>
              <p className="font-medium">{authorName}</p>
              <p className="text-gray-500 text-sm">{formatDate(blog.createdAt)}</p>
            </div>
          </div>
          
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </div>
      
      <div className="mt-6">
        <Link 
          to="/" 
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          ← Back to all blogs
        </Link>
      </div>
    </div>
  );
};

export default BlogDetailPage;