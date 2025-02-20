//src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import audioRoutes from "./api/routes/audioRoutes.js";
import authRoutes from "./api/routes/authRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;


const corsOptions = {
  origin: "*", 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions)); 

app.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.originalUrl}`);
  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


connectDB();


app.use("/api", audioRoutes);
app.use("/api/auth", authRoutes);


app.use((err, req, res, next) => {
  console.error(`Error in ${req.method} ${req.originalUrl}:`, err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});


process.on("SIGTERM", () => {
  mongoose.connection.close(() => {
    console.log("MongoDB disconnected due to app termination (SIGTERM)");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("MongoDB disconnected due to app termination (SIGINT)");
    process.exit(0);
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

