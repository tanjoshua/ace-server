const fs = require("fs");
const path = require("path");

const deleteResource = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    throw err;
  });
};

module.exports = deleteResource;
