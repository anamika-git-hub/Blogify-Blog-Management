import { Link } from 'react-router-dom';
import { Blog } from '../../types';
import { formatDate } from '../../utils/formatDate';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const authorName = typeof blog.user === 'object' ? blog.user.name : 'Unknown';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img 
          src={blog.image || '/placeholder-image.jpg'} 
          alt={blog.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">{blog.title}</h3>
        <div className="text-sm text-gray-600 mb-2">By {authorName} • {formatDate(blog.createdAt)}</div>
        <p className="text-gray-700 mb-4 line-clamp-2">{blog.content.replace(/<[^>]*>?/gm, '')}</p>
        <Link 
          to={`/blog/${blog._id}`}
          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;