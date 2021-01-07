const Tutor = require("../models/users/tutor");

// to be called only after checkAuth
module.exports = async (req, res, next) => {
  if (!req.userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  // check if user is tutor
  const tutor = await Tutor.findById(req.userId);
  if (!tutor) {
    const error = new Error("Forbidden");
    error.statusCode = 403;
    throw error;
  }

  next();
};
