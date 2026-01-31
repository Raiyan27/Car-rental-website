import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV } from "../config/environment.js";

/**
 * Connect to MongoDB using Mongoose
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // Modern Mongoose doesn't need these options
      // They are set by default in newer versions
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🔄 MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

/**
 * Close database connection
 * @returns {Promise<void>}
 */
export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("🔄 MongoDB connection closed");
  } catch (error) {
    console.error("❌ Error closing MongoDB connection:", error);
  }
};
