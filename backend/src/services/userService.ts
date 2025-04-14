import { UserRepository } from '../repositories/userRepository';
import { IUser } from '../models/userModel';
import { generateToken } from '../utils/jwt';
import { uploadToCloudinary } from '../utils/cloudinary';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData: Partial<IUser>): Promise<{ user: Partial<IUser>; token: string }> {
    const exists = await this.userRepository.exists(userData.email as string);
    if (exists) {
      throw new Error('User with this email already exists');
    }

    const user = await this.userRepository.create(userData);

    const token = generateToken(user);

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
  }

  async login(email: string, password: string): Promise<{ user: Partial<IUser>; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user);

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, token };
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUser(id: string, updateData: Partial<IUser>, avatarFile?: Buffer): Promise<IUser> {
    if (avatarFile) {
      const avatarUrl = await uploadToCloudinary(avatarFile, 'blog-platform/avatars');
      updateData.avatar = avatarUrl;
    }

    const user = await this.userRepository.update(id, updateData);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}