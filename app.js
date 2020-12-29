// node imports
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const { v4: uuid4 } = require("uuid");

// route imports
const listingRoutes = require("./routes/listings");
const authRoutes = require("./routes/auth");

// config imports - config file is not uploaded to repo
const config = require("./config");

// configure storage via multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuid4());
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// create express app
const app = express();

// set up body parser - parse json data
app.use(bodyParser.json());

// serving images statically
app.use("/images", express.static(path.join(__dirname, "images")));

// implement multer - receive as form data
app.use(multer({ storage: fileStorage, fileFilter }).single("image")); // image stored in req.file

// add header to all responses - allow CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// implement routes
app.use("/listings", listingRoutes);
app.use("/auth", authRoutes);

// handling errors
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;

  res.status(status).json({ message });
});

// connect database
mongoose.connect(
  config.MDB_KEY,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      // error occured
      console.log(err);
    } else {
      // start server
      app.listen(8080);
    }
  }
);
