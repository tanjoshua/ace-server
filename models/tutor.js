const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tutorSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Tutor", tutorSchema);
