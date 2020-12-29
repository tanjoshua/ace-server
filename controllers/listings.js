// node imports
const { validationResult } = require("express-validator");

// get listings
exports.getListings = (req, res, next) => {
  res.status(200).json({ listings: [] });
};

// create listing
exports.postListing = (req, res, next) => {
  // checking validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", errors: errors.array() });
  }

  // parsing in data
  const title = req.body.title;
  const description = req.body.description;

  // Create listing in database

  // successful response
  res.status(201).json({
    message: "Listing created",
    listing: {
      title,
      description,
    },
  });
};
