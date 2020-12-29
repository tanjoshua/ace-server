// node imports
const express = require("express");
const { body } = require("express-validator");

// controller imports
const authController = require("../controllers/auth");

const router = express.Router();

// POST /auth/signup
router.get("/signup", authController.signup);

// POST /auth/login
router.get("/login", authController.login);

module.exports = router;
