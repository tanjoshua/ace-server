// node imports
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// route imports
const listingRoutes = require("./routes/listings");

// config imports - config file is not uploaded to repo
const config = require("./config");

// create express app
const app = express();

// set up body parser - parse json data
app.use(bodyParser.json());

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

// connect database
mongoose.connect(config.MDB_KEY, { useNewUrlParser: true }, (err) => {
  if (err) {
    // error occured
    console.log(err);
  } else {
    // start server
    app.listen(8080);
  }
});
