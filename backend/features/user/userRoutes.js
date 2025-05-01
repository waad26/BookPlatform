const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const userController = require("./userController");
const authenticateToken = require("../../middleware/auth");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// sign up
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("name is required"),
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Email is invalid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  userController.signup
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  userController.loginUser
);

// log out
router.post("/logout", authenticateToken, userController.logoutUser);

// Protected profile route
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected profile route", user: req.user });
});

// Verify email
router.get("/verify/:token", userController.verifyEmail);

// Block user (admin only)
router.put("/block/:userId", authenticateToken, userController.blockUser);

// Unblock user (admin only)
router.put("/unblock/:userId", authenticateToken, userController.unblock);


module.exports = router;
