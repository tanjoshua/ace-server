// node imports
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const { v4: uuid4 } = require("uuid");
require("dotenv").config();
const helmet = require("helmet");
const compression = require("compression");

// route imports
const listingRoutes = require("./routes/listings");
const authRoutes = require("./routes/auth");

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

// use helmet to set standard http headers for security
app.use(helmet());
app.use(compression());

// implement routes
app.use("/listings", listingRoutes);
app.use("/auth", authRoutes);

// route not found
app.use("/", (req, res, next) => {
  res.status(404).json({ message: "route not found" });
});

// handling errors
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message;

  res.status(status).json({ message });
});

// connect database
mongoose
  .connect(process.env.MDB_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    // start server
    const server = app.listen(process.env.PORT || 3000);

    // set up socket
    const io = require("./utils/socket").init(server);
    io.on("connection", (socket) => {
      console.log("connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
