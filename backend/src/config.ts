
import dotenv from 'dotenv';

dotenv.config();
export const config = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};