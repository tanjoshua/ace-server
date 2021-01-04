const cloudinary = require("cloudinary").v2;

exports.upload = (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(file, (error, result) => {
      if (error) {
        throw new Error("Upload image failed");
      }
      resolve(result);
    });
  });
};
