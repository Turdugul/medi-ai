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

console.log("Frontend URL from ENV:", process.env.FRONTEND_URL);
console.log("API running on port:", PORT);

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL, 
  'https://dentists-assistant-ai-frontend.onrender.com',
];

const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log(`CORS Blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Enable pre-flight requests for all routes
app.options('*', cors(corsOptions));

// Apply CORS middleware
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", audioRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(`Error in ${req.method} ${req.originalUrl}:`, err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const shutdownMongo = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB disconnected due to app termination.");
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", shutdownMongo);
process.on("SIGINT", shutdownMongo);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
