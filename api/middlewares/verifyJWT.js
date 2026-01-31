import { config } from 'dotenv';
import jwt from 'jsonwebtoken'
config()
const JWT_SECRET = process.env.JWT_SECRET  

const verifyJWT = (req, res, next) => {
  const token = req.cookies?.token 

  if (!token) {
    return res.status(401).json({ error: 'Session expired or invalid. Please login again.' });
   }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default verifyJWT