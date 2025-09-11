import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js"
import { REFRESH_TOKEN_SECRET, NODE_ENV } from "../config/env";
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessTokenAndRefreshToken = asyncHandler(async (userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});
    return {accessToken, refreshToken};
})

const registerUser = asyncHandler( async (req, res) => {
    const { username, fullname, email, password, role} = req.body;
    if([username, fullname, email, password, role].some((fields) => {
        return fields?.trim() === "";
    })) {
        throw new ApiError(400, "All fields are required");
    };
    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    });
    if(existingUser){
        throw new ApiError(409, "User with username or email already exists");
    };

    await User.create({
        username,
        fullname,
        email,
        password,
        role
    })

    const createdUser = {
        username, 
        fullname,
        email,
        role
    }
    console.log(createdUser)
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully")
    )
})

const loginUser = asyncHandler( async (req, res) => {
    const { email, username, password} = req.body;
    if(!(username || email)) {
        throw new ApiError(400, "Username or email is required");
    }
    const user = await User.findOne({
        $or: [{username}, {email}]
    }).select("+password");

    if(!user){
        throw new ApiError(404, "User does not exist");
    }

    const isPassword = await user.isPasswordCorrect(password);

    if(!isPassword){
        throw new ApiError(400, "Invalid credentials")
    }

    const {accessToken, refreshToken} = generateAccessTokenAndRefreshToken(user._id);

    const loggedinUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, {
        user:loggedinUser,
        accessToken,
        refreshToken
    }, "User logged in successfully"));
})


