// node imports
const { validationResult } = require("express-validator");

// internal imports
const Listing = require("../models/listing");
const Tutor = require("../models/users/tutor");

// get listings
exports.getListings = async (req, res, next) => {
  try {
    let filter = {};
    let sortBy = { createdAt: -1 };

    const page = req.query.page || 1;
    const docsPerPage = 10;

    // implement sort
    if (req.query.sortBy) {
      //TODO: implement
    }

    // implement search query
    if (req.query.searchQuery) {
      filter = {
        // search in both title and description
        $or: [
          {
            title: { $regex: req.query.searchQuery, $options: "i" },
          },
          {
            description: { $regex: req.query.searchQuery, $options: "i" },
          },
        ],
      };
    }

    const result = await Listing.paginate(filter, {
      page,
      limit: docsPerPage,
      populate: {
        path: "tutor",
        sort: sortBy,
        select: "name profilePic totalRating ratingCount averageRating",
      },
    });

    res.json({
      listings: result.docs,
      totalCount: result.total,
      totalPages: Math.ceil(result.total / docsPerPage),
    });
  } catch (error) {
    return next(error);
  }
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
  const hourlyRate = req.body.hourlyRate;
  const tutorId = req.userId;

  // Create listing in database
  const listing = new Listing({
    title,
    description,
    hourlyRate,
    tutor: tutorId,
  });

  // save listing in database
  let listingResult;
  listing
    .save()
    .then((result) => {
      listingResult = result;
      return Tutor.findById(tutorId);
    })
    .then((tutor) => {
      // if tutor not found
      if (!tutor) {
        const error = new Error("Tutor not found");
        error.statusCode = 404;
        throw error;
      }

      tutor.listings.push(listingResult);
      return tutor.save();
    })
    .then(() => {
      // successful response
      res.status(201).json({
        message: "Listing created",
        listing: listingResult,
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
  const hourlyRate = req.body.hourlyRate;
  const description = req.body.description;

  // update in database
  Listing.findById(listingId)
    .then((listing) => {
      // listing not found
      if (!listing) {
        const error = new Error("No listing found");
        error.statusCode = 404;
        throw error;
      }

      // check if user is creator
      if (listing.tutor.toString() !== req.userId) {
        const error = new Error("Forbidden");
        error.statusCode = 403;
        throw error;
      }

      // listing found
      listing.title = title;
      listing.description = description;
      listing.hourlyRate = hourlyRate;
      return listing.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      return next(err);
    });
};

// delete listing
exports.deleteListing = (req, res, next) => {
  const listingId = req.params.listingId;

  Listing.findById(listingId)
    .then((listing) => {
      // listing not found
      if (!listing) {
        const error = new Error("Listing not found");
        error.statusCode = 404;
        throw error;
      }

      // check if user is creator
      if (listing.tutor.toString() !== req.userId) {
        const error = new Error("Forbidden");
        error.statusCode = 403;
        throw error;
      }

      // delete if no errors
      return Listing.findByIdAndDelete(listingId);
    })
    .then((listing) => {
      // listing not found
      if (!listing) {
        const error = new Error("Listing not found");
        error.statusCode = 404;
        throw error;
      }

      return Tutor.findById(listing.tutor);
    })
    .then((tutor) => {
      // remove from listings array
      tutor.listings.pull(listingId);
      return tutor.save();
    })
    .then(() => {
      res.json({ message: "Listing deleted" });
    })
    .catch((err) => {
      return next(err);
    });
};

// get single listing
exports.getListing = (req, res, next) => {
  const listingId = req.params.listingId;
  Listing.findById(listingId)
    .populate("tutor", "name profilePic totalRating ratingCount averageRating")
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
