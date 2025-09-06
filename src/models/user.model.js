import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } from "../config/env.js";

const userSchema = new Schema(
    {
        username: {
            type: String,
            lowercase: true,
            required: [true, "Username is required"],
            unique: [true, "This username is already taken"],
            minLength: 5,
            maxLength: 20,
            trim: true
        },
        fullname: {
            type: String,
            required: [true, "Fullname is required"],
            minLength: 5,
            maxLength: 30,
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            unique: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, 'Please fill a valid email']
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
            select: false
        },
        role: {
            type: String,
            required: true,
            enum: "user" | "admin",
            defaault: "user"
        },
        refreshToken: {
            type: String
        }
    }, {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    if(!this.password){
        throw new Error("Password not set for user document");
    }
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id:this._id,
        role: this.role
    }, ACCESS_TOKEN_SECRET,{
        expiresIn: ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    }, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY
    })
}

const User = mongoose.model('User', userSchema);

export default User;