import mongoose from "mongoose";
import { MONGODB_URI } from "../config/env.js";

if(!MONGODB_URI) throw new Error('Please declare the MONGODB_URI in the env.<production/development>.local')

const connectToDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to the database successfully');
    } catch(error){
        console.error('Connection to the database failed: ', error.message);
        throw new Error('Connection to the database failed');
    }
}

export default connectToDB;