// config/db.js

import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

let gridFSBucket;


const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set");
    }

    console.log("Connecting to MongoDB...");
    
    // Connection options for better compatibility
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log("✅ MongoDB Connected");
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Host: ${conn.connection.host}`);

    const db = conn.connection.db;
    gridFSBucket = new GridFSBucket(db, { bucketName: "uploads" });

  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    
    // Provide helpful error messages
    if (err.message.includes("authentication failed") || err.code === 8000) {
      console.error("\n💡 Authentication Error - Check the following:");
      console.error("   1. Verify your MongoDB username and password are correct");
      console.error("   2. Ensure special characters in password are URL-encoded");
      console.error("   3. Check if the database user exists in MongoDB Atlas");
      console.error("   4. Verify IP whitelist includes Render's IP (0.0.0.0/0 for all)");
      console.error("   5. Connection string format: mongodb+srv://username:password@cluster.mongodb.net/dbname");
    } else if (err.message.includes("ENOTFOUND") || err.message.includes("getaddrinfo")) {
      console.error("\n💡 Network Error - Check the following:");
      console.error("   1. Verify your MongoDB cluster URL is correct");
      console.error("   2. Check your internet connection");
      console.error("   3. Ensure MongoDB Atlas cluster is running");
    }
    
    console.error("\nFull error:", err);
    process.exit(1);
  }
};


const storage = multer.memoryStorage();
const upload = multer({ storage });


export { connectDB, upload, gridFSBucket };

