import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema ({
    username: {
        type: String,
        lowercase: true,
        unique: [true, "Username must be unique"],
        trim: true,
        minLength: 2,
        maxLength: 10,
        required: [true, "Username is required"]
    },
    fullname: {
        type: String,
        trim: true,
        minLength: 2,
        maxLength: 20,
        required: [true, "Fullname of the user is required"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, "Email is required"],
        unique: [true, "Email must be unique"],
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 8,
        select: false
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timeseries: true
})

const User = model('User', userSchema);

export default User;