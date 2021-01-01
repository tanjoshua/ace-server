// node imports
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// internal imports
const User = require("../models/users/user");
const Tutor = require("../models/users/tutor");
const Student = require("../models/users/student");
const Parent = require("../models/users/parent");

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
  const type = req.body.type;

  // handle profile pic
  let profilePicPath;
  if (req.file) {
    profilePicPath = req.file.path;
  }

  bcrypt
    .hash(password, 12)
    .then((result) => {
      const userDetails = { email, name, profilePicPath, password: result };
      let user;

      // handle account types
      switch (type) {
        case "tutor":
          user = new Tutor(userDetails);
          break;
        case "student":
          user = new Student(userDetails);
          break;
        case "parent":
          parent = new Parent(userDetails);
          break;
        default:
          const error = new Error("Invalid type");
          error.statusCode = 422;
          throw error;
      }

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
          process.env.JWT_KEY
        );

        res.json({ token, userId: user._id.toString() });
      });
    })
    .catch((err) => {
      return next(err);
    });
};
