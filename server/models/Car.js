import mongoose from "mongoose";

const { Schema } = mongoose;

const carSchema = new Schema({
  model: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  availability: {
    type: String,
    default: "Available",
  },
  registration: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: "At least one image is required",
    },
  },
  user: {
    type: Schema.Types.Mixed, // For backward compatibility with existing data
    required: true,
  },
  bookingCount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for performance
carSchema.index({ "user.email": 1, createdAt: -1 });
carSchema.index({ model: 1 });
carSchema.index({ availability: 1 });

export default mongoose.model("Car", carSchema);
