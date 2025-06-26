const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const { CORS_ORIGIN, PORT, JWT_SECRET } = require("./config/constants");

// Import routes
const authRoutes = require("./routes/auth");
const vehicleRoutes = require("./routes/vehicle");
const tripRoutes = require("./routes/trip");
const fuelRoutes = require("./routes/fuel");
const uploadRoutes = require("./routes/upload");
const rideboardRoutes = require("./routes/rideboard/rideboard");

// Load environment variables
dotenv.config();
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'set' : 'not set');
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('AWS_BUCKET_NAME:', process.env.AWS_BUCKET_NAME);
// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/fuel", fuelRoutes);
app.use("/api", uploadRoutes);
app.use("/api/rideboard", rideboardRoutes);
// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "✅ Motolog API Server is running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      vehicles: "/api/vehicle",
      trips: "/api/trip",
      fuel: "/api/fuel",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error("🔥 Global error:", error);

  // Handle authentication errors
  if (error.name === "UnauthorizedError") {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
      message: "Please sign in to access this resource",
    });
  }

  // Handle validation errors
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: error.message,
    });
  }

  // Handle duplicate key errors
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      error: "Duplicate entry",
      message: "This record already exists",
    });
  }

  // Handle mongoose cast errors
  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: "Invalid ID format",
      message: "The provided ID is not valid",
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
