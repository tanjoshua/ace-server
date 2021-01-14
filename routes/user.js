// node imports
const express = require("express");

// internal imports
const userController = require("../controllers/user");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

// GET /user/
router.get("/", checkAuth, userController.getUserDetails);

module.exports = router;
