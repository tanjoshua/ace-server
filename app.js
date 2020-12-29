// node imports
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

// route imports
const listingRoutes = require("./routes/listings");

// config imports - config file is not uploaded to repo
const config = require("./config");

// create express app
const app = express();

// set up body parser - parse json data
app.use(bodyParser.json());

// serving images statically
app.use("/images", express.static(path.join(__dirname, "images")));

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
