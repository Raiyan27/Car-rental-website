import express from "express";
import {
  createReview,
  getAllReviews,
  getCarReviews,
  getUserReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";

const router = express.Router();

// Public routes
router.get("/car/:carId", getCarReviews);

// Protected routes
router.post("/", verifyToken, validate(schemas.createReview), createReview);
router.get("/user/reviews", verifyToken, getUserReviews);
router.patch("/:id", verifyToken, updateReview);
router.delete("/:id", verifyToken, deleteReview);

// Admin routes (add admin middleware later if needed)
router.get("/", getAllReviews);

export default router;
