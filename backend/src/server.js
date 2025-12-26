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

console.log("Frontend URL from ENV: ", process.env.FRONTEND_URL);
console.log("API running on port:", PORT);

// CORS configuration - use environment variable or default origins
const getAllowedOrigins = () => {
  const origins = [];
  
  // Add FRONTEND_URL if set
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }
  
  if (process.env.NODE_ENV === 'production') {
    // Add all possible production frontend URLs
    origins.push(
      'https://medi-ai-frontend.onrender.com',
      'https://dentists-assistant-ai-frontend.onrender.com',
      'https://medi-ai.onrender.com'
    );
    // Allow all Render subdomains using wildcard pattern
    origins.push('https://*.onrender.com');
  } else {
    // Development: allow localhost
    origins.push('http://localhost:3000', 'http://localhost:3001');
  }
  
  return origins;
};

const allowedOrigins = getAllowedOrigins();
console.log('🌐 Allowed CORS origins:', allowedOrigins);

// Helper function to check if origin matches allowed pattern
const isOriginAllowed = (origin, allowedOrigins) => {
  return allowedOrigins.some(allowed => {
    // Exact match
    if (origin === allowed) {
      return true;
    }
    
    // Handle wildcard patterns like https://*.onrender.com or *.onrender.com
    if (allowed.includes('*')) {
      // Convert wildcard pattern to regex
      // *.onrender.com -> .*\.onrender\.com
      // https://*.onrender.com -> https://.*\.onrender\.com
      const regexPattern = allowed
        .replace(/\./g, '\\.')  // Escape dots
        .replace(/\*/g, '.*');   // Replace * with .*
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(origin);
    }
    
    return false;
  });
};

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('⚠️  Request with no origin - allowing');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    const isAllowed = isOriginAllowed(origin, allowedOrigins);
    
    // In production, only allow if explicitly in allowed list
    // In development, allow all origins for easier debugging
    if (isAllowed || process.env.NODE_ENV !== 'production') {
      console.log(`✅ CORS allowing origin: ${origin}`);
      callback(null, true);
    } else {
      console.log(`⚠️  CORS blocked origin: ${origin}`);
      console.log(`⚠️  Allowed origins:`, allowedOrigins);
      console.log(`⚠️  NODE_ENV: ${process.env.NODE_ENV}`);
      // In production, be strict
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Add headers middleware for additional CORS support
// This ensures CORS headers are set even if cors middleware doesn't catch it
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (origin) {
    // Check if origin is allowed (use same logic as corsOptions)
    const isAllowed = isOriginAllowed(origin, allowedOrigins);
    
    // Only set Access-Control-Allow-Origin if origin is allowed OR in development
    if (isAllowed || process.env.NODE_ENV !== 'production') {
      res.header('Access-Control-Allow-Origin', origin);
    }
  } else if (process.env.NODE_ENV !== 'production') {
    // Allow no origin in development only
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  // Always set these headers for CORS
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log(`   Origin: ${req.headers.origin || 'none'}`);
  console.log(`   Content-Type: ${req.headers['content-type'] || 'none'}`);
  if (req.method === 'OPTIONS') {
    console.log(`   CORS Preflight request`);
  }
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
