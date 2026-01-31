import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Environment configuration
export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGODB_URI =
  process.env.MONGODB_URI ||
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@practisecluster.7glnk.mongodb.net/?retryWrites=true&w=majority&appName=PractiseCluster`;

// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// CORS configuration
export const CORS_OPTIONS = {
  origin:
    NODE_ENV === "production"
      ? [
          "https://gari-chai-27.web.app",
          "https://gari-chai.surge.sh",
          "https://gari-chai.netlify.app",
        ]
      : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
};

// Validation
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required");
}

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error("Cloudinary environment variables are required");
}
