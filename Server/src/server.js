const { inject, errorHandler } = require("express-custom-error");
inject(); 
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const logger = require("./util/logger");
require("mandatoryenv").load(["DB_URL", "PORT", "SECRET"]);
const { PORT } = process.env;

// Instantiate an Express Application
const app = express();

// Configure Express App Instance
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Configure custom logger middleware
app.use(logger.dev, logger.combined);

app.use(cookieParser());
const cors_options = {
	origin: ["http://localhost:3000", "https://www.talkeys.xyz"],
	credentials: true,
};
app.use(cors(cors_options));

// This middleware adds the json header to every response
app.use("*", (req, res, next) => {
	res.setHeader("Content-Type", "application/json");
	next();
});

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
			serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
		});
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
};
connectDB();



//  WebSocket Integration 
const http = require("http");
const socketIO = require("socket.io");
const registerSocketHandlers = require("./socketHandler");

const server = http.createServer(app);
const io = socketIO(server, {
	cors: {
		origin: ["http://localhost:3000", "https://www.talkeys.xyz"],
		credentials: true,
	},
});

registerSocketHandlers(io); // initialize socket events

// Start both Express + WebSocket server
server.listen(PORT, () => {
	console.info(`🚀 Server listening on port ${PORT}`);
});
