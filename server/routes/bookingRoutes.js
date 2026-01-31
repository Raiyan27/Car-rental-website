import express from "express";
import {
  createBooking,
  getUserBookings,
  getCarBookings,
  getCarBookingsPublic,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookingController.js";
import { verifyToken } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";

const router = express.Router();

// Public route for getting car bookings (for booking modal)
router.get("/car/:carId/public", getCarBookingsPublic);

// All booking routes require authentication
router.post("/", verifyToken, validate(schemas.createBooking), createBooking);
router.get("/user", verifyToken, getUserBookings);
router.get("/car/:carId", verifyToken, getCarBookings);
router.patch(
  "/:id",
  verifyToken,
  validate(schemas.updateBooking),
  updateBooking,
);
router.patch(
  "/:id/status",
  verifyToken,
  validate(schemas.bookingAction),
  updateBookingStatus,
);
router.delete("/:id", verifyToken, deleteBooking);

export default router;
