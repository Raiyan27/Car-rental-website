import express from "express";
import {
  generateToken,
  logout,
  refreshToken,
  verifyTokenEndpoint,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/login", generateToken);

// Protected routes
router.post("/logout", logout);
router.post("/refresh", verifyToken, refreshToken);
router.get("/verify", verifyToken, verifyTokenEndpoint);

export default router;
