// node imports
const express = require("express");
const { body } = require("express-validator");

// internal imports
const listingController = require("../controllers/listings");
const checkAuth = require("../middleware/checkAuth");
const checkTutor = require("../middleware/checkTutor");

const router = express.Router();

// GET /listings
// queries: page
router.get("/", checkAuth, listingController.getListings);

// POST /listings
router.post(
  "/",
  checkAuth,
  checkTutor, // only tutors can create listings
  // validation
  [
    body("title").trim().isLength({ min: 5 }),
    body("description").trim(),
    body("hourlyRate").notEmpty(),
  ],
  listingController.postListing
);

// PUT /listings/:listingId
router.put(
  "/:listingId",
  checkAuth,
  // validation
  [body("title").trim().isLength({ min: 5 }), body("description").trim()],
  listingController.updateListing
);

// DELETE /listings/listingId
router.delete("/:listingId", checkAuth, listingController.deleteListing);

// GET /listings/:listingId
router.get("/:listingId", checkAuth, listingController.getListing);

module.exports = router;
