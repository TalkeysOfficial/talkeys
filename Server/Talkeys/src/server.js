// Patches
const { inject, errorHandler } = require("express-custom-error");
inject(); // Patch express in order to use async / await syntax

// Require Dependencies

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

const logger = require("./util/logger");

// Load .env Enviroment Variables to process.env

require("mandatoryenv").load(["DB_URL", "PORT", "SECRET"]);

const { PORT } = process.env;

exports.verifyToken = async (req, res, next) => {
	try {
		const data = req.headers.authorization;
		const idtoken = data.split(" ")[1];
		// console.log("Token:", idtoken);

		if (!idtoken) {
			return res.status(403).json({ message: "No token provided" });
		}
		const ticket = await client.verifyIdToken({
			idToken: idtoken,
			audience: CLIENT_ID, // Verify the token is intended for this client
		});
		console.log("Ticket:");
		const payload = ticket.getPayload();
		console.log("Payload:", payload);
		var user = await User.findOne({ email: payload.email });
		console.log("hh");
		if (!user) {
			var user = new User({
				email: payload.email,
				name: payload.name,
				picture: payload.picture,
			});
			await user.save();
		}
		console.log("created successfully");
		// user.accessToken=jwt.sign({email:payload.email},secret,{expiresIn:86400});
		const accessToken = jwt.sign({ email: payload.email }, secret, {
			expiresIn: 86400,
		});
		res.json(accessToken);
	} catch (err) {
		console.log(err);
	}
};

exports.protected = (req, res) => {
	res.send("Protected route");
};

exports.logout = (req, res) => {
	res.clearCookie("jwt");
	res.send("Logged out");
};

// Instantiate an Express Application
const app = express();

// Configure Express App Instance
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Configure custom logger middleware
app.use(logger.dev, logger.combined);

app.use(cookieParser());
const cors_options = {
	origin: [
		"https://www.talkeyz.xyz",
		"https://talkeyz.xyz",
		"http://localhost:3000",
	],
	credentials: true,
};
app.use(cors(cors_options));
app.use(helmet());

// This middleware adds the json header to every response
app.use("*", (req, res, next) => {
	res.setHeader("Content-Type", "application/json");
	next();
});

// Assign Routes

app.use("/", require("./routes/router"));

// Handle errors
app.use(errorHandler());

// Handle not valid route
app.use("*", (req, res) => {
	res.status(404).json({ status: false, message: "Endpoint Not Found" });
});
const mongoose = require("mongoose");

const { DB_URL } = process.env;
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
		});
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
};
connectDB();

// Open Server on selected Port
app.listen(PORT, () => console.info("Server listening on port ", PORT));
