import Joi from "joi";

/**
 * Validation middleware using Joi
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Validation middleware
 */
export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors,
      });
    }

    req[property] = value;
    next();
  };
};

// Validation schemas
export const schemas = {
  // Car validation schemas
  createCar: Joi.object({
    model: Joi.string().required().trim().max(100),
    price: Joi.number().positive().required(),
    availability: Joi.string().default("Available"),
    registration: Joi.string().required().trim(),
    features: Joi.array().items(Joi.string()).default([]),
    description: Joi.string().required().min(10).max(1000),
    location: Joi.string().required().trim(),
    images: Joi.array().items(Joi.string().uri()).min(1).required(),
    user: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    }).required(),
  }),

  updateCar: Joi.object({
    model: Joi.string().trim().max(100),
    price: Joi.number().positive(),
    availability: Joi.string(),
    registration: Joi.string().trim(),
    features: Joi.array().items(Joi.string()),
    description: Joi.string().min(10).max(1000),
    location: Joi.string().trim(),
    images: Joi.array().items(Joi.string().uri()).min(1),
  }).min(1), // At least one field must be provided

  // Booking validation schemas
  createBooking: Joi.object({
    carId: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().when("startDate", {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref("startDate")).required(),
    }),
    totalPrice: Joi.number().positive().required(),
    email: Joi.string().email().required(),
  }),

  updateBooking: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().when("startDate", {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref("startDate")).required(),
    }),
    totalPrice: Joi.number().positive(),
  }),

  // Review validation schemas
  createReview: Joi.object({
    carId: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().required().min(10).max(1000),
    model: Joi.string().required(),
    owner: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    }).required(),
    reviewer: Joi.string().required(),
    reviewerPhoto: Joi.string().uri().optional(),
  }),

  // Query parameter validation
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),

  carQuery: Joi.object({
    email: Joi.string().email().required(),
    searchQuery: Joi.string().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(5),
  }),

  // Auth validation
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  // Booking action validation
  bookingAction: Joi.object({
    action: Joi.string().valid("confirm", "cancel").required(),
  }),
};
