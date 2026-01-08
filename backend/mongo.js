import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connectMongoDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "writing_app"
        });
        console.log("Connected to MongoDB")
    } catch(err){
        console.error("MongoDB connection error::", err);
    }
}