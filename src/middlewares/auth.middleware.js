import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/env.js"
import User from "../models/user.model.js"

export const authorize = async(req, res, next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token) return res.status(401).json({
            success: false,
            message: "No token found"
        });

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userID).select('-password');

        if(!user) return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        })

        req.user = user;
        next();
    } catch (error){
        console.error('Authorization error: ', error.message);
        res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid Token'
        });
    }
}
