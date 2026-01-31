import Review from "../models/Review.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import { ApiResponse } from "../utils/response.js";
import { asyncHandler } from "../middleware/errorHandler.js";

/**
 * Create new review
 */
export const createReview = asyncHandler(async (req, res) => {
  const { car, booking, rating, comment } = req.body;

  // Check if car exists and get car details
  const carDoc = await Car.findById(car);
  if (!carDoc) {
    return ApiResponse.notFound(res, "Car not found");
  }

  // Check if booking exists and belongs to the user
  const bookingDoc = await Booking.findById(booking);
  if (!bookingDoc) {
    return ApiResponse.notFound(res, "Booking not found");
  }

  if (bookingDoc.clientEmail !== req.user.email) {
    return ApiResponse.forbidden(res, "You can only review your own bookings");
  }

  // Check if booking is confirmed or completed (allow reviews for active/completed bookings)
  if (!["Confirmed", "Completed"].includes(bookingDoc.status)) {
    return ApiResponse.badRequest(
      res,
      `You can only review confirmed or completed bookings. Current status: ${bookingDoc.status}`,
    );
  }

  // Check if user already reviewed this car
  const existingReview = await Review.findOne({
    carId: car,
    reviewer: req.user.email,
  });
  if (existingReview) {
    return ApiResponse.conflict(res, "You have already reviewed this car");
  }

  // Extract owner information from car data
  let ownerName = "Unknown";
  let ownerEmail = "";

  if (typeof carDoc.user === "object" && carDoc.user !== null) {
    ownerName = carDoc.user.name || "Unknown";
    ownerEmail = carDoc.user.email || "";
  } else if (typeof carDoc.user === "string") {
    // Assume it's an email
    ownerEmail = carDoc.user;
    ownerName = "Unknown";
  }

  const reviewData = {
    carId: car,
    model: carDoc.model,
    owner: {
      name: ownerName,
      email: ownerEmail,
    },
    reviewer: req.user.email,
    reviewerPhoto: req.user.photoURL || null,
    rating: parseInt(rating),
    comment,
    createdAt: new Date(),
  };

  const review = new Review(reviewData);
  await review.save();

  // Update car's rating and review count
  const allReviews = await Review.find({ carId: car });
  const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalRating / allReviews.length;

  await Car.findByIdAndUpdate(car, {
    rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    reviewCount: allReviews.length,
  });

  ApiResponse.created(res, review, "Review added successfully");
});

/**
 * Get all reviews (admin endpoint)
 */
export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({}).sort({ createdAt: -1 }).lean();

  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");

  ApiResponse.success(res, reviews, "Reviews retrieved successfully");
});

/**
 * Get reviews for a specific car
 */
export const getCarReviews = asyncHandler(async (req, res) => {
  const { carId } = req.params;

  // Check if car exists
  const car = await Car.findById(carId);
  if (!car) {
    return ApiResponse.notFound(res, "Car not found");
  }

  const reviews = await Review.find({ carId }).sort({ createdAt: -1 }).lean();

  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");

  ApiResponse.success(res, reviews, "Car reviews retrieved successfully");
});

/**
 * Get reviews by reviewer (user's reviews)
 */
export const getUserReviews = asyncHandler(async (req, res) => {
  const { email } = req.query;

  // Verify user owns the data
  if (req.user.email !== email) {
    return ApiResponse.forbidden(res, "Email mismatch, Forbidden access");
  }

  const reviews = await Review.find({ reviewer: email })
    .populate("carId", "model images")
    .sort({ createdAt: -1 })
    .lean();

  ApiResponse.success(res, reviews, "User reviews retrieved successfully");
});

/**
 * Update review (reviewer only)
 */
export const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const review = await Review.findById(id);
  if (!review) {
    return ApiResponse.notFound(res, "Review not found");
  }

  // Verify ownership
  if (review.reviewer !== req.user.email) {
    return ApiResponse.forbidden(res, "You can only update your own reviews");
  }

  const updateData = {
    ...(rating && { rating: parseInt(rating) }),
    ...(comment && { comment }),
  };

  const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  // Update car's average rating
  if (rating) {
    const allReviews = await Review.find({ carId: review.carId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allReviews.length;

    await Car.findByIdAndUpdate(review.carId, {
      rating: Math.round(averageRating * 10) / 10,
    });
  }

  ApiResponse.success(res, updatedReview, "Review updated successfully");
});

/**
 * Delete review (reviewer or car owner)
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    return ApiResponse.notFound(res, "Review not found");
  }

  // Check permissions
  const car = await Car.findById(review.carId);
  const isReviewer = review.reviewer === req.user.email;
  const isCarOwner = car.user.email === req.user.email;

  if (!isReviewer && !isCarOwner) {
    return ApiResponse.forbidden(
      res,
      "You can only delete your own reviews or reviews on your cars",
    );
  }

  await Review.findByIdAndDelete(id);

  // Update car's rating and review count
  const remainingReviews = await Review.find({ carId: review.carId });
  if (remainingReviews.length > 0) {
    const totalRating = remainingReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / remainingReviews.length;

    await Car.findByIdAndUpdate(review.carId, {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: remainingReviews.length,
    });
  } else {
    // No reviews left
    await Car.findByIdAndUpdate(review.carId, {
      rating: 0,
      reviewCount: 0,
    });
  }

  ApiResponse.success(res, null, "Review deleted successfully");
});
