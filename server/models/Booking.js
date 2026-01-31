import mongoose from "mongoose";

const { Schema } = mongoose;

const bookingSchema = new Schema({
  carId: {
    type: Schema.Types.ObjectId,
    ref: "Car",
    required: true,
    index: true,
  },
  carModel: {
    type: String,
    required: true,
    index: true,
  },
  carImageUrl: {
    type: String,
    required: true,
    index: true,
  },
  clientEmail: {
    type: String,
    required: true,
    index: true,
  },
  startDate: {
    type: Date,
    required: true,
    index: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Canceled", "Completed"],
    default: "Pending",
    index: true,
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

// Compound indexes
bookingSchema.index({ carId: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ clientEmail: 1, status: 1 });

export default mongoose.model("Booking", bookingSchema);
