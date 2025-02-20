import User from "../../database/User.js";
import { generateToken } from "../../utils/jwtUtils.js"; 

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required." });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }


    const user = new User({ name, email, password });

    // Save the user to the database
    await user.save();

    console.log("✅ User registered with hashed password:", user.password);

    // Generate JWT Token (include userId)
    const token = generateToken(user);

    // Respond with token and user details
    res.status(201).json({ 
      success: true, 
      message: "User registered successfully", 
      token,  
      user: { id: user._id, name: user.name, email: user.email }  
    });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("🔍 Entered Password:", password);
    console.log("🔐 Stored Hashed Password:", user.password);

    // Compare entered password with stored hashed password using comparePassword method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token with userId
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Error logging in user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    console.log("🔍 Request User:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user data" });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Sending Profile:", user);
    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
