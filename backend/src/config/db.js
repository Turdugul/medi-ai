// config/db.js

import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

let gridFSBucket;


const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const db = conn.connection.db;

  
    gridFSBucket = new GridFSBucket(db, { bucketName: "uploads" });

  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};


const storage = multer.memoryStorage();
const upload = multer({ storage });


export { connectDB, upload, gridFSBucket };

