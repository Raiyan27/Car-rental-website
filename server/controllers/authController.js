import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/response.js";
import { JWT_SECRET, NODE_ENV } from "../config/environment.js";
import { asyncHandler } from "../middleware/errorHandler.js";

/**
 * Generate JWT token for user authentication
 * This endpoint expects user data from Firebase authentication
 */
export const generateToken = asyncHandler(async (req, res) => {
  const user = req.body;

  if (!user || !user.email) {
    return ApiResponse.badRequest(res, "User data with email is required");
  }

  const token = jwt.sign(user, JWT_SECRET, {
    expiresIn: "7d", // Extended from 5h to 7d for better UX
  });

  // Set httpOnly cookie for security
  res.cookie("token", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  ApiResponse.success(res, { token }, "Token generated successfully");
});

/**
 * Logout user by clearing JWT cookie
 */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "none" : "strict",
  });

  ApiResponse.success(res, null, "Logged out successfully");
});

/**
 * Refresh JWT token
 * Generates a new token with extended expiration
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const user = req.user; // From verifyToken middleware

  const newToken = jwt.sign(
    {
      email: user.email,
      name: user.name,
      // Add other user properties as needed
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  // Update cookie with new token
  res.cookie("token", newToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  ApiResponse.success(res, { token: newToken }, "Token refreshed successfully");
});

/**
 * Verify token endpoint (for client-side token validation)
 */
export const verifyTokenEndpoint = asyncHandler(async (req, res) => {
  // If we reach here, token is valid (verified by middleware)
  ApiResponse.success(
    res,
    {
      user: req.user,
      valid: true,
    },
    "Token is valid",
  );
});
