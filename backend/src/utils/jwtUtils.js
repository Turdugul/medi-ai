import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined!");
  process.exit(1);  
}

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, name: user.name, email: user.email }, 
    JWT_SECRET, 
    { expiresIn: '7d' }    
  );
};

export { generateToken };
