import { Schema, model, models, Document } from 'mongoose';

interface IUser extends Document {
    name: string;
    email: string;
    walletAddress: string;
    userRole: string;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    walletAddress: { type: String, required: true, unique: true },
    userRole: { type: String, required: true },
}, {
    timestamps: true,
});

const User = models.User || model<IUser>('User', UserSchema);


export default User;