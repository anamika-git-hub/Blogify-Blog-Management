import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

interface BlogFormProps {
  initialValues: {
    title: string;
    content: string;
  };
  onSubmit: (values: { title: string; content: string }, image: File | null) => Promise<void>;
  buttonText: string;
  existingImage?: string;
}

const BlogForm: React.FC<BlogFormProps> = ({ initialValues, onSubmit, buttonText, existingImage }) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(existingImage || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required').min(5, 'Title must be at least 5 characters'),
    content: Yup.string().required('Content is required').min(20, 'Content must be at least 20 characters'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await onSubmit(values, image);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {formik.touched.title && formik.errors.title && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={6}
          value={formik.values.content}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {formik.touched.content && formik.errors.content && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.content}</div>
        )}
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Blog Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          {!existingImage || image ? 'Please upload an image for your blog' : 'Leave empty to keep the current image'}
        </p>
        
        {imagePreview && (
          <div className="mt-2 relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="h-32 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setImagePreview(existingImage|| '');
              }}
              className={`absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full ${!image && existingImage ? 'hidden' : ''}`}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting || !formik.isValid}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isSubmitting || !formik.isValid ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Processing...' : buttonText}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;