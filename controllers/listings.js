// node imports
const { validationResult } = require("express-validator");

// internal imports
const Listing = require("../models/listing");

// get listings
exports.getListings = (req, res, next) => {
  Listing.find()
    .then((listings) => {
      res.json({ listings });
    })
    .catch((err) => {
      return next(err);
    });
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
  let imagePath;

  // handle image
  if (req.file) {
    imagePath = req.file.path;
  }

  // Create listing in database
  const listing = new Listing({
    title,
    description,
    imagePath,
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
      next(err); // status code will be by default 500
    });
};

// get single listing
exports.getListing = (req, res, next) => {
  const listingId = req.params.listingId;
  Listing.findById(listingId)
    .then((listing) => {
      if (!listing) {
        // no listing found
        const error = new Error("No listing found");
        error.statusCode = 404;
        return next(error);
      }

      res.json(listing);
    })
    .catch((err) => {
      next(err);
    });
};
