// node imports
const { validationResult } = require("express-validator");

// internal imports
const Listing = require("../models/listing");

// get listings
exports.getListings = (req, res, next) => {
  res.status(200).json({ listings: [] });
};

// create listing
exports.postListing = (req, res, next) => {
  // checking validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Validation failed");
    err.statusCode = 422;
    return next(err);
  }

  // parsing in data
  const title = req.body.title;
  const description = req.body.description;
  const tutor = req.body.tutor;

  // Create listing in database
  const listing = new Listing({
    title,
    description,
    imagePath: "",
    tutor,
  });

  // save listing in database
  listing
    .save()
    .then((result) => {
      // successful response
      res.status(201).json({
        message: "Listing created",
        listing,
      });
    })
    .catch((err) => {
      err.statusCode = 500;
      next(err);
    });
};
