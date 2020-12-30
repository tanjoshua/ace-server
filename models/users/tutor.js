const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const tutorSchema = Schema({
  description: {
    type: String,
  },
});

module.exports = User.discriminator("Tutor", tutorSchema);
