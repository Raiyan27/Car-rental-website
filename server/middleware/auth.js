import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/environment.js";

/**
 * JWT token verification middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(403).json({
      success: false,
      error: "Invalid token",
    });
  }
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Silently fail for optional auth
      console.warn("Optional auth token invalid:", error.message);
    }
  }

  next();
};
