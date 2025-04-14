import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (fileBuffer: Buffer, folder: string): Promise<string> => {
  try {
    const fileStr = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(fileStr, {
      folder,
      resource_type: 'auto',
    });
    
    return result.secure_url;
  } catch (error: any) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error: any) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

export default cloudinary;