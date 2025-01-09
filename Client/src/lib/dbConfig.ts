import mongoose, { Connection, ConnectOptions } from "mongoose";

let cachedDb: Connection | null = null;

const dbConfig = async (): Promise<Connection> => {
	if (cachedDb) {
		return cachedDb;
	}

	const dbUri = process.env.MONGODB_URI;
	if (!dbUri) {
		throw new Error("Please define the MONGODB_URI environment variable");
	}

	const options: ConnectOptions = {
		dbName: "talkeys",
	};

	try {
		const connection = await mongoose.connect(dbUri, options);
		cachedDb = connection.connection;
		return connection.connection;
	} catch (error) {
		console.error("Failed to connect to the database", error);
		throw error;
	}
};

export default dbConfig;
