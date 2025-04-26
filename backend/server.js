require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const userRoutes = require("./features/user/userRoutes");
const bookRoutes = require("./features/books/bookRoutes");
const reviewRoutes = require("./features/review/reviewRoutes");

const app = express();
// update port 
const PORT = process.env.PORT || 5000;

const authenticate = require('./middleware/auth');

app.use(cors());
app.use(express.json());
app.use('/api/reviews', reviewRoutes);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: "Too many login attempts, please try again later.",
});
app.use("/api/users/login", loginLimiter);

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
