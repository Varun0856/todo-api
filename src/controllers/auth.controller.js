import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRY, NODE_ENV } from "../config/env.js";

const registerUser = async(req, res) => {
    try {
        const {username, fullname, email, password} = req.body;
        if([username, fullname, email, password].some((fields) => {
            return fields?.trim() === "";
        })){
            return res.status(400).json({
                success: false,
                message: 'Please fill out all the fields'
            });
        }
    
        const existingUser = await User.findOne({
            $or: [{username}, {email}]
        })
    
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User with that username or email already exists"
            });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            fullname,
            email,
            password: hashedPassword,
            role: "user"
        });
    
        if(!newUser){
            return res.status(500).json({
                success: false,
                message: "Failed to create user. Please try again later"
            })
        }
    
        return res.status(200).json({
            success: true,
            message: "User created successfully",
            data: [
                username, 
                fullname,
                email,
                role
            ]
        })
    } catch (error) {
        console.error("Error on the registeredUser", error.message)
        return res.status(500).json({
            success: false,
            message: "Something went wrong on our side, please try again later"
        })
    }
}

const loginUser = async(req, res) => {
    try {
        const {username, email, password} = req.body;
        if([username, email, password].some((fields) => {
            return fields?.trim() === ""
        })) {
            return res.status(400).json({
                success: false,
                message: "Please fill out all the necessary fields"
            });
        };
        const user = await User.findOne({
            $or: [{username}, {email}]
        }).select("+password");
    
        if(!user){
            return res.status(404).json({
                success: false,
                message: "Invalid credentials"
            })
        }
    
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
        if(!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }
    
        const token = jwt.sign({
            userID: user._id,
            role: user.role
        }, JWT_SECRET, {
            expiresIn: JWT_EXPIRY
        });
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
        })
    } catch (error) {
        console.error("Error on login User function", error.message)

        return res.status(500).json({
            success: false,
            message: "Something went wrong on our side. Please try again later"
        })
    }
}

export {
    registerUser,
    loginUser
}