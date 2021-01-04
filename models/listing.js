const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
    tutor: {
      type: Schema.Types.ObjectId,
      ref: "Tutor",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
