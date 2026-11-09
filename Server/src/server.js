const app = require("./app");
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const { cleanupExpiredPasses } = require("./modules/passes/passes.controller");

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.DB_URL, {
			serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
		});
		console.log(`MongoDB Connected: ${conn.connection.host}`);
		// Release seats held by unpaid bookings; nothing else ever expires them.
		setInterval(cleanupExpiredPasses, 5 * 60 * 1000).unref();
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
};
connectDB();

// Open Server on selected Port
app.listen(PORT, () => console.info("Server listening on port ", PORT));
