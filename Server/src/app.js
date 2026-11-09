require('dotenv').config();
const { inject, errorHandler } = require("express-custom-error");
inject();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("./shared/logger");
const path = require("path");
// const PORT = 300;


// Instantiate an Express Application
const app = express();

// Configure Express App Instance
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));




// Configure custom logger middleware
app.use(logger.dev, logger.combined);

app.use(cookieParser());
app.use(cors());

// Handle preflight requests
app.options('*', cors());

// This middleware adds the json header to every response
app.use("*", (req, res, next) => {
	if (!req.is("multipart/form-data")) {
		res.setHeader("Content-Type", "application/json");
	}
	next();
});



app.use("/", require("./routes/router"));

// Handle errors
app.use(errorHandler());

// Handle not valid route
app.use("*", (req, res) => {
	res.status(404).json({ status: false, message: "Endpoint Not Found" });
});

module.exports = app;
