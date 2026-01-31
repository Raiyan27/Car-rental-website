import Car from "../models/Car.js";
import { ApiResponse } from "../utils/response.js";
import { asyncHandler } from "../middleware/errorHandler.js";

/**
 * Get all cars (public endpoint)
 * Supports pagination and search
 */
export const getCars = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const skip = (page - 1) * limit;

  // Build search query
  const searchQuery = search
    ? {
        $or: [
          { model: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { "user.name": { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const cars = await Car.find(searchQuery)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 })
    .lean();

  const total = await Car.countDocuments(searchQuery);

  const pagination = {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit),
  };

  // Set cache headers for public data
  res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");

  ApiResponse.success(
    res,
    cars,
    "Cars retrieved successfully",
    200,
    pagination,
  );
});

/**
 * Get cars for a specific user (protected)
 * Supports pagination and search
 */
export const getUserCars = asyncHandler(async (req, res) => {
  const { email, page = 1, limit = 5, searchQuery = "" } = req.query;
  const skip = (page - 1) * limit;

  // Verify user owns the data
  if (req.user.email !== email) {
    return ApiResponse.forbidden(res, "Email mismatch, Forbidden access");
  }

  const query = { "user.email": email };

  // Add search functionality
  if (searchQuery) {
    const priceQuery = parseFloat(searchQuery);
    query.$or = [
      { model: { $regex: searchQuery, $options: "i" } },
      { availability: { $regex: searchQuery, $options: "i" } },
    ];
    if (!isNaN(priceQuery)) query.$or.push({ price: priceQuery });
  }

  const cars = await Car.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 })
    .lean();

  const total = await Car.countDocuments(query);

  const pagination = {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit),
  };

  ApiResponse.success(
    res,
    cars,
    "User cars retrieved successfully",
    200,
    pagination,
  );
});

/**
 * Get single car by ID (public)
 */
export const getCarById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const car = await Car.findById(id).lean();

  if (!car) {
    return ApiResponse.notFound(res, "Car not found");
  }

  // Set cache headers
  res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");

  ApiResponse.success(res, car, "Car retrieved successfully");
});

/**
 * Create new car (protected)
 */
export const createCar = asyncHandler(async (req, res) => {
  const carData = {
    ...req.body,
    user: req.user, // From JWT token
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const car = new Car(carData);
  await car.save();

  ApiResponse.created(res, car, "Car added successfully");
});

/**
 * Update car (protected - owner only)
 */
export const updateCar = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const car = await Car.findById(id);

  if (!car) {
    return ApiResponse.notFound(res, "Car not found");
  }

  // Check ownership
  if (car.user.email !== req.user.email) {
    return ApiResponse.forbidden(res, "You can only update your own cars");
  }

  const updateData = {
    ...req.body,
    updatedAt: new Date(),
  };

  const updatedCar = await Car.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  ApiResponse.success(res, updatedCar, "Car updated successfully");
});

/**
 * Delete car (protected - owner only)
 */
export const deleteCar = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const car = await Car.findById(id);

  if (!car) {
    return ApiResponse.notFound(res, "Car not found");
  }

  // Check ownership
  if (car.user.email !== req.user.email) {
    return ApiResponse.forbidden(res, "You can only delete your own cars");
  }

  await Car.findByIdAndDelete(id);

  ApiResponse.success(res, null, "Car deleted successfully");
});
