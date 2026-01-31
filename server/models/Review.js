import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema({
  carId: {
    type: Schema.Types.ObjectId,
    ref: "Car",
    required: true,
    index: true,
  },
  model: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.Mixed, // For backward compatibility
    required: true,
  },
  reviewer: {
    type: String,
    required: true,
    index: true,
  },
  reviewerPhoto: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Ensure one review per user per car
reviewSchema.index({ carId: 1, reviewer: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
