import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export default async function authMiddleware(req, res, next) {
  // Get token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Not authorized or token missing.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found. Unauthorized." });
    }
    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    console.log("JWT verification failed:", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid token or expired." });
  }
}
