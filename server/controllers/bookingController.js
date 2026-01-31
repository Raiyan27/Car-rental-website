import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import { ApiResponse } from "../utils/response.js";
import { asyncHandler } from "../middleware/errorHandler.js";

/**
 * Create new booking
 */
export const createBooking = asyncHandler(async (req, res) => {
  const { carId, startDate, endDate, totalPrice, email } = req.body;

  // Check if car exists and is available
  const car = await Car.findById(carId);
  if (!car) {
    return ApiResponse.notFound(res, "Car not found");
  }

  if (car.availability !== "Available") {
    return ApiResponse.conflict(res, "Car is not available for booking");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check for booking conflicts (only with confirmed bookings)
  const conflict = await Booking.findOne({
    carId,
    status: "Confirmed",
    $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
  });

  if (conflict) {
    return ApiResponse.conflict(
      res,
      "Car is already booked for the specified dates",
    );
  }

  const bookingData = {
    carId,
    clientEmail: email,
    startDate: start,
    endDate: end,
    totalPrice,
    status: "Pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const booking = new Booking(bookingData);
  await booking.save();

  // Increment booking count on car
  await Car.findByIdAndUpdate(carId, { $inc: { bookingCount: 1 } });

  ApiResponse.created(res, booking, "Booking added successfully");
});

/**
 * Get user's bookings (protected)
 */
export const getUserBookings = asyncHandler(async (req, res) => {
  const { email } = req.query;

  // Verify user owns the data
  if (req.user.email !== email) {
    return ApiResponse.forbidden(res, "Email mismatch, Forbidden access");
  }

  const bookings = await Booking.find({ clientEmail: email })
    .sort({ createdAt: -1 })
    .lean();

  if (bookings.length === 0) {
    return ApiResponse.notFound(res, "No bookings found for this email");
  }

  ApiResponse.success(res, bookings, "Bookings retrieved successfully");
});

/**
 * Get bookings for a specific car (owner only)
 */
export const getCarBookings = asyncHandler(async (req, res) => {
  const { carId } = req.params;

  // Verify car ownership
  const car = await Car.findById(carId);
  if (!car) {
    return ApiResponse.notFound(res, "Car not found");
  }

  if (car.user.email !== req.user.email) {
    return ApiResponse.forbidden(
      res,
      "You can only view bookings for your own cars",
    );
  }

  const bookings = await Booking.find({ carId }).sort({ createdAt: -1 }).lean();

  ApiResponse.success(res, bookings, "Car bookings retrieved successfully");
});

/**
 * Get confirmed bookings for a specific car (public - for booking modal)
 */
export const getCarBookingsPublic = asyncHandler(async (req, res) => {
  const { carId } = req.params;

  // Verify car exists
  const car = await Car.findById(carId);
  if (!car) {
    return ApiResponse.notFound(res, "Car not found");
  }

  // Get current date (start of today in UTC)
  const now = new Date();
  const today = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
  );

  // Get confirmed and pending bookings that end today or later
  const bookings = await Booking.find({
    carId,
    status: { $in: ["Confirmed", "Pending"] },
    endDate: { $gte: today }, // End date is today or later
  })
    .sort({ startDate: 1 })
    .lean();

  ApiResponse.success(res, bookings, "Car bookings retrieved successfully");
});

/**
 * Update booking (user can update their own bookings)
 */
export const updateBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate, totalPrice } = req.body;

  const booking = await Booking.findById(id);
  if (!booking) {
    return ApiResponse.notFound(res, "Booking not found");
  }

  // Verify ownership
  if (booking.clientEmail !== req.user.email) {
    return ApiResponse.forbidden(res, "You can only update your own bookings");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check for conflicts (excluding current booking)
  const conflict = await Booking.findOne({
    carId: booking.carId,
    _id: { $ne: id },
    $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
  });

  if (conflict) {
    return ApiResponse.conflict(
      res,
      "Car is already booked for the specified dates",
    );
  }

  const updateData = {
    startDate: start,
    endDate: end,
    totalPrice: totalPrice || booking.totalPrice,
    updatedAt: new Date(),
  };

  const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  ApiResponse.success(res, updatedBooking, "Booking updated successfully");
});

/**
 * Update booking status (confirm/cancel)
 */
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  const booking = await Booking.findById(id);
  if (!booking) {
    return ApiResponse.notFound(res, "Booking not found");
  }

  // Allow the booker to cancel their own booking, or the car owner to confirm/cancel
  const car = await Car.findById(booking.carId);
  const isOwner = car.user.email === req.user.email;
  const isBooker = booking.clientEmail === req.user.email;

  if (action === "cancel") {
    // Only the booker can cancel their booking
    if (!isBooker) {
      return ApiResponse.forbidden(
        res,
        "You can only cancel your own bookings",
      );
    }
  } else if (action === "confirm") {
    // Only the car owner can confirm bookings
    if (!isOwner) {
      return ApiResponse.forbidden(
        res,
        "You can only confirm bookings for your own cars",
      );
    }
  } else {
    return ApiResponse.badRequest(res, "Invalid action");
  }

  let newStatus;
  if (action === "confirm") {
    newStatus = "Confirmed";
  } else if (action === "cancel") {
    newStatus = "Canceled";
  } else {
    return ApiResponse.badRequest(res, "Invalid action");
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    id,
    {
      status: newStatus,
      updatedAt: new Date(),
    },
    { new: true },
  );

  ApiResponse.success(res, updatedBooking, `Booking ${action}ed successfully`);
});

/**
 * Delete booking
 */
export const deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) {
    return ApiResponse.notFound(res, "Booking not found");
  }

  // Allow deletion by either the booker or car owner
  const car = await Car.findById(booking.carId);
  const isOwner = car.user.email === req.user.email;
  const isBooker = booking.clientEmail === req.user.email;

  if (!isOwner && !isBooker) {
    return ApiResponse.forbidden(
      res,
      "You can only delete your own bookings or bookings for your cars",
    );
  }

  await Booking.findByIdAndDelete(id);

  // Decrement booking count if booking was not canceled
  if (booking.status !== "Canceled") {
    await Car.findByIdAndUpdate(booking.carId, { $inc: { bookingCount: -1 } });
  }

  ApiResponse.success(res, null, "Booking deleted successfully");
});
