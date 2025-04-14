
import jwt from 'jsonwebtoken';
import { IUser } from '../models/userModel';

export const generateToken = (user: IUser): string => {
    return jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'default_secret',
      {
        expiresIn: process.env.JWT_EXPIRE || '30d',
      }
    );
  };