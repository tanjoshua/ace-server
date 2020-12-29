// node imports
const express = require("express");
const { body } = require("express-validator");

// controller imports
const listingController = require("../controllers/listings");

const router = express.Router();

// GET /listings
// queries: page
router.get("/", listingController.getListings);

// POST /listings
router.post(
  "/",
  // validation
  [body("title").trim().isLength({ min: 5 }), body("description").trim()],
  listingController.postListing
);

// PUT /listings/:listingId
router.put(
  "/:listingId",
  // validation
  [body("title").trim().isLength({ min: 5 }), body("description").trim()],
  listingController.updateListing
);

// DELETE /listings/listingId
router.delete("/:listingId", listingController.deleteListing);

// GET /listings/:listingId
router.get("/:listingId", listingController.getListing);

module.exports = router;
