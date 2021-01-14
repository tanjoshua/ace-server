const jwt = require("jsonwebtoken");

// token will be in the Authorization header eg. Bearer <token>
// userId will be placed in req.userId
module.exports = (req, res, next) => {
  let token = req.get("Authorization");

  // no token attached
  if (!token) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  // parse token
  token = token.split(" ")[1];

  try {
    token = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    throw err;
  }

  // not authenticated
  if (!token) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  // valid token
  req.userId = token.userId;
  next();
};
