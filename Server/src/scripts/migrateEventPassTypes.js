require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("../models/events.model");

const migrateEventPassTypes = async () => {
	if (!process.env.DB_URL) {
		throw new Error("DB_URL is required");
	}

	await mongoose.connect(process.env.DB_URL, {
		serverSelectionTimeoutMS: 15000,
	});

	const events = await Event.find({
		$or: [
			{ passTypes: { $exists: false } },
			{ passTypes: { $size: 0 } },
		],
	});

	for (const event of events) {
		const totalQuantity = Number(event.totalSeats || 0);
		const bookedQuantity = Number(event.registrationCount || 0);

		event.passTypes = [
			{
				name: "General Pass",
				price: Number(event.ticketPrice || 0),
				description: "",
				totalQuantity,
				maxAvailable: totalQuantity,
				soldQuantity: bookedQuantity,
				bookedQuantity,
				isActive: true,
			},
		];

		await event.save();
	}

	console.log(`Migrated ${events.length} event(s) to passTypes.`);
	await mongoose.disconnect();
};

migrateEventPassTypes().catch(async (error) => {
	console.error("Pass type migration failed:", error);
	await mongoose.disconnect();
	process.exit(1);
});
