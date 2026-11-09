require('dotenv').config();
const { inject, errorHandler } = require("express-custom-error");
inject();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("./util/logger");
const path = require("path");
// require("mandatoryenv").load(["DB_URL", "PORT", "SECRET"]);
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
// const cors_options = {
// 	origin: [
// 		"http://localhost:3000",
// 		"https://www.talkeys.xyz",
// 		"http://localhost:3001",
// 		"https://talkeys.vercel.app",
// 	],
// 	credentials: true,
// 	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// 	allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
// };
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
