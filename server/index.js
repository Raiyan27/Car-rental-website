import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import configurations and utilities
import { PORT, CORS_OPTIONS } from "./config/environment.js";
import { connectDB } from "./utils/database.js";

// Import middleware
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

// Initialize Express app
const app = express();

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();

    // Middleware (order matters!)
    app.use(cors(CORS_OPTIONS));
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Request logging middleware
    app.use((req, res, next) => {
      const start = Date.now();
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

      res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(
          `${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`,
        );
      });

      next();
    });

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });

    // API Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/cars", carRoutes);
    app.use("/api/bookings", bookingRoutes);
    app.use("/api/reviews", reviewRoutes);

    // Legacy routes for backward compatibility (will be removed in future)
    app.get("/cars", async (req, res) => {
      // Redirect to new API
      res.redirect(301, "/api/cars");
    });

    app.get("/car/:id", async (req, res) => {
      res.redirect(301, `/api/cars/${req.params.id}`);
    });

    // 404 handler
    app.use(notFoundHandler);

    // Global error handler (must be last)
    app.use(errorHandler);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  process.exit(0);
});
