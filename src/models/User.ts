import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document{
    email: string,
    password: string,
    name: string,
    confirmed: boolean,
};

const useSchema : Schema= new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    confirmed: {
        type: Boolean,
        default: false,
    },
});

const User =  mongoose.model<IUser>('User', useSchema);

export default User;