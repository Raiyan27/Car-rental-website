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

// CORS configuration
export const CORS_OPTIONS = {
  origin: [
    "https://gari-chai-27.web.app",
    "https://gari-chai.surge.sh",
    "http://localhost:5173",
    "https://gari-chai.netlify.app",
  ],
  credentials: true,
};

// Validation
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required");
}
