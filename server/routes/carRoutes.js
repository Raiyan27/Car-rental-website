import express from "express";
import {
  getCars,
  getUserCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from "../controllers/carController.js";
import { verifyToken } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";

const router = express.Router();

// Public routes
router.get("/", getCars);
router.get("/:id", getCarById);

// Protected routes
router.get(
  "/user/cars",
  verifyToken,
  validate(schemas.carQuery, "query"),
  getUserCars,
);
router.post("/", verifyToken, validate(schemas.createCar), createCar);
router.patch("/:id", verifyToken, validate(schemas.updateCar), updateCar);
router.delete("/:id", verifyToken, deleteCar);

export default router;
