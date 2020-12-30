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
});

module.exports = User.discriminator("Tutor", tutorSchema);
