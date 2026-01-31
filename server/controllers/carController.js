import Car from "../models/Car.js";
import { ApiResponse } from "../utils/response.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";

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
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");

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
  const { email, page = 1, limit = 10, searchQuery = "" } = req.query;
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
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");

  ApiResponse.success(res, car, "Car retrieved successfully");
});

/**
 * Create new car (protected)
 */
export const createCar = asyncHandler(async (req, res) => {
  const { images, ...carData } = req.body;

  // Validate required fields
  if (
    !carData.model ||
    !carData.price ||
    !carData.location ||
    !carData.description ||
    !images ||
    images.length === 0
  ) {
    return ApiResponse.badRequest(res, "Missing required fields or images");
  }

  // Upload images to Cloudinary
  const uploadedImages = [];
  try {
    for (const base64Image of images) {
      const uploadedImage = await uploadImage(base64Image, "gari-chai/cars");
      uploadedImages.push(uploadedImage);
    }
  } catch (error) {
    // Clean up uploaded images if any failed
    for (const img of uploadedImages) {
      await deleteImage(img.public_id);
    }
    return ApiResponse.error(res, "Failed to upload images", 500);
  }

  const car = new Car({
    ...carData,
    images: uploadedImages,
    user: req.user,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await car.save();

  ApiResponse.created(res, car, "Car added successfully");
});

/**
 * Update car (protected - owner only)
 */
export const updateCar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { images, ...updateData } = req.body;

  const car = await Car.findById(id);

  if (!car) {
    return ApiResponse.notFound(res, "Car not found");
  }

  // Check ownership
  if (car.user.email !== req.user.email) {
    return ApiResponse.forbidden(res, "You can only update your own cars");
  }

  // Handle image updates if provided
  if (images && images.length > 0) {
    // Separate existing images (objects) from new images (base64 strings)
    const existingImages = images.filter(
      (img) => typeof img === "object" && img.url,
    );
    const newBase64Images = images.filter((img) => typeof img === "string");

    // If we have new images to upload, delete old images that are not being kept
    if (newBase64Images.length > 0) {
      const imagesToDelete = car.images.filter(
        (oldImg) =>
          !existingImages.some(
            (newImg) => newImg.public_id === oldImg.public_id,
          ),
      );

      for (const img of imagesToDelete) {
        await deleteImage(img.public_id);
      }

      // Upload new base64 images
      const uploadedImages = [];
      try {
        for (const base64Image of newBase64Images) {
          const uploadedImage = await uploadImage(
            base64Image,
            "gari-chai/cars",
          );
          uploadedImages.push(uploadedImage);
        }
        updateData.images = [...existingImages, ...uploadedImages];
      } catch (error) {
        return ApiResponse.error(res, "Failed to upload new images", 500);
      }
    } else {
      // No new images, just update with existing images
      updateData.images = existingImages;
    }
  }

  const updatedCar = await Car.findByIdAndUpdate(
    id,
    {
      ...updateData,
      updatedAt: new Date(),
    },
    {
      new: true,
      runValidators: true,
    },
  );

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

  // Delete images from Cloudinary
  for (const img of car.images) {
    await deleteImage(img.public_id);
  }

  await Car.findByIdAndDelete(id);

  ApiResponse.success(res, null, "Car deleted successfully");
});
