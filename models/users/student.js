const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const studentSchema = Schema({
  School: {
    type: String,
    required: false,
  },
  Standard: {
    type: String,
    required: false,
  },
  Parent: {
    type: Schema.Types.ObjectId,
    ref: "Parent",
    required: false,
  },
});

module.exports = User.discriminator("Student", studentSchema);
