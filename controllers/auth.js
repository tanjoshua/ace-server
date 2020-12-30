// node imports
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// internal imports
const config = require("../config"); // not stored in repo
const User = require("../models/user");

// signup
exports.signup = (req, res, next) => {
  // checking validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Validation failed");
    err.statusCode = 422;
    return next(err);
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((result) => {
      const user = new User({ email, name, password: result });
      return user.save();
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      return next(err);
    });
};

// login
exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 401; // or 404
        return next(error);
      }

      bcrypt.compare(password, user.password).then((result) => {
        if (!result) {
          const error = new Error("Wrong password");
          error.statusCode = 401; // or 404
          return next(error);
        }

        // create jwt
        const token = jwt.sign(
          {
            name: user.name,
            email: user.email,
            userId: user._id.toString(),
          },
          config.JWT_KEY
        );

        res.json({ token, userId: user._id.toString() });
      });
    })
    .catch((err) => {
      return next(err);
    });
};
