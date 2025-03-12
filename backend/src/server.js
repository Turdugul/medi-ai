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

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.CORS_ORIGIN]
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

connectDB()
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api", audioRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(`❌ Error in ${req.method} ${req.originalUrl}:`, err.stack);
  res.status(500).json({ 
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const shutdownMongo = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB disconnected due to app termination");
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", shutdownMongo);
process.on("SIGINT", shutdownMongo);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 Server running on port ${PORT}
🌍 Environment: ${process.env.NODE_ENV}
📝 API Documentation: /api-docs
❤️  Health Check: /health
  `);
});
