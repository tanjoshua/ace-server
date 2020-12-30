// node imports
const express = require("express");
const { body } = require("express-validator");

// internal imports
const authController = require("../controllers/auth");
const User = require("../models/users/user");

const router = express.Router();

// POST /auth/signup
router.post(
  "/signup",
  // validation
  [
    body("email")
      .isEmail()
      .custom((value) => {
        // check if email is already used
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 6 }),
    body("name").trim().notEmpty().isAlpha(),
  ],
  authController.signup
);

// POST /auth/login
router.post("/login", authController.login);

module.exports = router;
