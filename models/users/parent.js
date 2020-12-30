const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const parentSchema = Schema({
  // can change to multiple students
  Student: {
    type: mongoose.Types.ObjectId,
    ref: "Student",
    required: false,
  },
});

module.exports = User.discriminator("Parent", parentSchema);
