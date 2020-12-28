// get listings
exports.getListings = (req, res, next) => {
  res.status(200).json({ listings: [] });
};

// create listing
exports.postListing = (req, res, next) => {
  // parsing in data
  const title = req.body.title;

  // Create listing in database

  // successful response
  res.status(201).json({
    message: "Listing created",
    listing: {
      title,
    },
  });
};
