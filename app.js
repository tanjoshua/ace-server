// node imports
const express = require("express");
const bodyParser = require("body-parser");

// route imports
const listingRoutes = require("./routes/listings");

// create express app
const app = express();

// set up body parser - parse json data
app.use(bodyParser.json());

// implement routes
app.use("/listings", listingRoutes);

// start server
app.listen(8080);
