// node imports
const express = require("express");
const bodyParser = require("body-parser");

// route imports
const listingRoutes = require("./routes/listings");

// create express app
const app = express();

// set up body parser - parse json data
app.use(bodyParser.json());

// add header to all responses
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

// start server
app.listen(8080);
