import express from "express";
import { register, login, getUserProfile} from "../controllers/authController.js";
import authMiddleware from "../../middleware/authMiddleware.js"; 

const router = express.Router();

// Test endpoint to verify route is accessible
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working", timestamp: new Date().toISOString() });
});

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authMiddleware, getUserProfile); 
export default router;
