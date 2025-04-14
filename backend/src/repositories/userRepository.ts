import { User,IUser } from "../models/userModel";
import mongoose from "mongoose";

export class UserRepository {
    async create(userData: Partial<IUser>): Promise<IUser> {
        return await User.create(userData);
    }

    async findById(id: string): Promise<IUser | null> {
        return await User.findById(id).select('-password');

    }

    async findByEmail (email: string): Promise <IUser | null> {
        return await User.findOne({email}).select('+password');
    }

    async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        }).select('-password');
    }

    async delete(id: string): Promise<boolean> {
        const result = await User.findByIdAndDelete(id);
        return !!result;
    }

    async exists(email: string): Promise<boolean> {
        const count = await User.countDocuments({email});
        return count> 0;
    }
}