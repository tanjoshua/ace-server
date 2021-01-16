const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const tutorSchema = Schema({
  description: {
    type: String,
  },
  listings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],
  totalRating: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
});

// compute average rating TODO: fix
tutorSchema.virtual("averageRating").get(() => {
  console.log(this.totalRating);
  console.log(this.ratingCount);
  console.log(this.totalRating / this.ratingCount);
  if (this.ratingCount !== 0) {
    return parseFloat(this.totalRating) / this.ratingCount;
  } else {
    return 0;
  }
});
tutorSchema.set("toObject", { virtuals: true });
tutorSchema.set("toJSON", { virtuals: true });

module.exports = User.discriminator("Tutor", tutorSchema);
