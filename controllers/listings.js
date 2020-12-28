// get listings
exports.getListings = (req, res, next) => {
  res.status(200).json({ listings: [] });
};

// create listing
exports.postListing = (req, res, next) => {
  // Create listing in database

  res.status(201).json({
    message: "Listing created",
  });
};
