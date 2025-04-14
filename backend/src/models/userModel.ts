import mongoose,{Document,Schema} from "mongoose";
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        name:{
            type:String,
            required:[true,'Name is required'],
            trim: true,
            maxlength:[50,'Name cannot be more than 50 characters']
        },
        email:{
            type: String,
            required: [true,'Email is required'],
            unique: true,
            trim: true,
            match: [
                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                'Please add a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6,'Password must be at least 6 characters'],
            select:false,
        },
        avatar: {
            type: String,
            default:'https://res.cloudinary.com/demo/image/upload/v158012503/samples/people/boy-snow-hoodie.jpg'
        },
        bio:{
            type: String,
            maxlength: [500,'Bio cannot be more than 500 characters'],
            default:'',
        },
    },
    {
        timestamps:true,
    }
);

UserSchema.pre<IUser>('save',async function (next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword,this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);