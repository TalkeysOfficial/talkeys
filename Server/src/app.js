require('dotenv').config();
const { errorHandler } = require("express-custom-error");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const logger = require("./shared/logger");
const path = require("path");
// const PORT = 300;


// Instantiate an Express Application
const app = express();

// The API sits behind nginx on the same host (Docker bridge): trust X-Forwarded-For only from private hops,
// so req.ip is the real client and a direct client cannot spoof it.
app.set("trust proxy", "loopback, linklocal, uniquelocal");

// Configure Express App Instance
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
// Express 5 leaves req.body undefined when no body was parsed; handlers rely on the Express 4 default of {}.
app.use((req, res, next) => {
	req.body ??= {};
	next();
});
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));




// Configure custom logger middleware
app.use(logger.dev, logger.combined);

app.use(cookieParser());

// Browsers call the API directly, so only the site's own origins may read responses.
// CORS_ORIGINS (comma-separated) adds more, e.g. a Vercel preview URL.
const corsOptions = {
	origin: [
		"https://talkeys.xyz",
		"https://www.talkeys.xyz",
		process.env.FRONTEND_URL,
		...(process.env.CORS_ORIGINS ?? "").split(","),
	]
		.map((origin) => origin?.trim())
		.filter(Boolean),
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options(/.*/, cors(corsOptions));

// Anti-flood limits per client IP. Generous on purpose: a whole campus can share one NAT address.
const limitOptions = {
	windowMs: 60 * 1000,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	message: { status: false, message: "Too many requests, try again in a minute." },
};
app.use(rateLimit({ ...limitOptions, limit: 600 }));
app.use(["/verify", "/api/book-ticket", "/bookPass"], rateLimit({ ...limitOptions, limit: 60 }));

// This middleware adds the json header to every response
app.use((req, res, next) => {
	if (!req.is("multipart/form-data")) {
		res.setHeader("Content-Type", "application/json");
	}
	next();
});



app.use("/", require("./routes/router"));

// Handle errors
app.use(errorHandler());

// Handle not valid route
app.use((req, res) => {
	res.status(404).json({ status: false, message: "Endpoint Not Found" });
});

module.exports = app;
