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

router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Email is invalid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  userController.registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  userController.loginUser
);

router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected profile route", user: req.user });
});

module.exports = router;
