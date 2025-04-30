require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const userRoutes = require("./features/user/userRoutes");
const bookRoutes = require("./features/books/bookRoutes");
const reviewRoutes = require("./features/review/reviewRoutes");

const app = express();

// Update port
const PORT = process.env.PORT || 3000;

// Authentication middleware
const authenticate = require('./middleware/auth');

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiter for login (protect login route)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many login attempts, please try again later.",
});
app.use("/api/users/login", loginLimiter);

// Rate limiter for reviews (protect reviews route)
const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: "Too many review submissions, please try again later."
});
app.use("/api/reviews", reviewLimiter, reviewRoutes);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});