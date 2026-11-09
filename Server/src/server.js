const app = require("./app");
const PORT = process.env.PORT;
const mongoose = require("mongoose");

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

// Open Server on selected Port
app.listen(PORT, () => console.info("Server listening on port ", PORT));
