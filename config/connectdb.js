import mongoose from "mongoose";
import UserModel from "../models/user.js";
const connectDB = async(DATABASE_URL) => {
    try{
        const DB_OPTIONS = {
            
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS)
        console.log('Connected Successfully!...');
    }catch(error){
        console.log(error)
    }
}
export default connectDB;
