// node imports
const { validationResult } = require("express-validator");

// internal imports
const Listing = require("../models/listing");

// get listings
exports.getListings = (req, res, next) => {
  const page = req.query.page || 1;
  const count = 10;
  let totalCount;

  Listing.countDocuments()
    .then((num) => {
      totalCount = num;
      return Listing.find()
        .skip((page - 1) * count)
        .limit(count);
    })
    .then((listings) => {
      res.json({ listings, totalCount);
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
        listing: result,
      });
    })
    .catch((err) => {
      next(err); // status code will be by default 500
    });
};

// update listing
exports.updateListing = (req, res, next) => {
  // checking validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Validation failed");
    err.statusCode = 422;
    return next(err);
  }

  // parsing data
  const listingId = req.params.listingId;
  const title = req.body.title;
  const description = req.body.description;

  // update in database
  Listing.findById(listingId)
    .then((listing) => {
      // listing not found
      if (!listing) {
        const error = new Error("No listing found");
        error.statusCode = 404;
        return next(error);
      }

      // listing found
      listing.title = title;
      listing.description = description;
      return listing.save();
    })
    .then((result) => {
      res.status(200).json(result);
    });
};

// delete listing
exports.deleteListing = (req, res, next) => {
  const listingId = req.params.listingId;

  Listing.findByIdAndDelete(listingId, (err, result) => {
    if (err) {
      return next(err);
    }

    // not found
    if (!result) {
      const error = new Error("Listing not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(result);
  });
};

// get single listing
exports.getListing = (req, res, next) => {
  const listingId = req.params.listingId;
  Listing.findById(listingId)
    .then((listing) => {
      // listing not found
      if (!listing) {
        const error = new Error("No listing found");
        error.statusCode = 404;
        return next(error);
      }

      // listing found
      res.json(listing);
    })
    .catch((err) => {
      next(err);
    });
};
