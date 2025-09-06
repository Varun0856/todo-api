import mongoose from "mongoose";
import { MONGODB_URI } from "../config/env.js";

if (!MONGODB_URI) {
    console.log("Please state the MONGODB_URI in the 'env.<development/production>.local file")
}

const connectToDB = async() => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Database connected successfully");
    } catch (error) {
        throw new Error("Error connecting to Database: ", error);
    }
}

export default connectToDB;