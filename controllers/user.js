// node imports
const jwt = require("jsonwebtoken");

// internal imports
const User = require("../models/users/user");

exports.getUserDetails = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }
    res.json(user);
  } catch (error) {}
};
