const express = require("express");

// controller imports
const listingController = require("../controllers/listings");

const router = express.Router();

// GET /listings
router.get("/", listingController.getListings);

// POST /listings
router.post("/", listingController.postListing);

module.exports = router;
