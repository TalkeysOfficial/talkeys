const asyncHandler = require("express-async-handler");
const Event = require("../models/events.model.js");
const reqEvent = require("../models/reqEvent.model.js");
const { validateEvent } = require("../schemas/event.schema.js");

const createEvent = asyncHandler(async (req, res) => {
	if (!req.body) {
		return res.status(400).json({ message: "Event data is required" });
	}
	if (req.user.role !== "admin") {
		return res.status(403).json({
			message: "Forbidden: You do not have permission to create events",
		});
	}

	try {
		const {
			eventName,
			category,
			mode,
			location,
			duration,
			ticketPrice,
			totalSeats,
			visibility,
			prizes,
			photographs,
			startDate,
			startTime,
			startRegistrationDate,
			eventDescription,
		} = req.body;
		const event = new Event({
			eventName,
			category,
			mode,
			location,
			duration,
			ticketPrice,
			totalSeats,
			visibility,
			prizes,
			photographs,
			startDate,
			startTime,
			startRegistrationDate,
			eventDescription,
			organiserId: req.user._id,
		});
		await event.save();
		res.status(201).json(event);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

function mergeDateTime(date, timeStr) {
	if (!date) return null;
	if (!timeStr) return new Date(date); // fallback if no time given

	const [hours, minutes] = timeStr.split(":").map(Number);
	const merged = new Date(date);
	merged.setUTCHours(hours, minutes, 0, 0);
	return merged;
}

const getEvents = asyncHandler(async (req, res) => {
	try {
		const {
			page = 1,
			limit = 10,
			sortBy = "startDate",
			order = "asc",
			mode,
			category,
			visibility,
			search = "",
			minPrice,
			maxPrice,
		} = req.query;

		const query = {};
		if (mode) query.mode = mode;
		if (category) query.category = category;
		if (visibility) query.visibility = visibility;

		if (minPrice || maxPrice) {
			query.ticketPrice = {};
			if (minPrice) query.ticketPrice.$gte = Number(minPrice);
			if (maxPrice) query.ticketPrice.$lte = Number(maxPrice);
		}

		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ eventDescription: { $regex: search, $options: "i" } },
				{ category: { $regex: search, $options: "i" } },
			];
		}

		const skip = (parseInt(page) - 1) * parseInt(limit);
		const sortOptions = { [sortBy]: order === "desc" ? -1 : 1 };

		let events = await Event.find(query)
			.select("-__v")
			.sort(sortOptions)
			.skip(skip)
			.limit(parseInt(limit));

		// Attach computed fields
		events = events.map(event => {
			const startDateTime = mergeDateTime(event.startDate, event.startTime);
			const startRegistrationDate = event.startRegistrationDate;
			const availableSeats = event.totalSeats - (event.registrationCount || 0);

			return {
				...event.toObject(),
				startDateTime,
				startRegistrationDate,
				availableSeats,
				status: event.getStatus(), // Now this will work and console.log
			};
		});

		const total = await Event.countDocuments(query);

		res.status(200).json({
			status: "success",
			data: {
				events,
				pagination: {
					total,
					page: parseInt(page),
					pages: Math.ceil(total / parseInt(limit)),
					limit: parseInt(limit),
				},
			},
		});
	} catch (error) {
		console.error("Error in getEvents:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to fetch events",
			error: error.message,
		});
	}
});

const getEventById = async (req, res) => {
	try {
		const { id } = req.params;
		const event = await Event.findById(id).select("-__v");

		if (!event) {
			return res.status(404).json({
				status: "error",
				message: "Event not found",
			});
		}

		const startDateTime = event.startDateTime || mergeDateTime(event.startDate, event.startTime);
		const startRegistrationDate = event.startRegistrationDate;
		const availableSeats = event.totalSeats - (event.registrationCount || 0);

		res.status(200).json({
			status: "success",
			data: {
				...event.toObject(),
				startDateTime,
				startRegistrationDate,
				availableSeats,
				status: event.getStatus(), // Now this will work and console.log
			},
		});
	} catch (error) {
		console.error("Error in getEventById:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to fetch event",
			error: error.message,
		});
	}
};

const likeEvent = asyncHandler(async (req, res) => {
	const { id: eventID } = req.params;

	try {
		const event = await Event.findById(eventID)?.select("_id")?.lean();
		if (!event) {
			return res.status(404).json({
				status: "error",
				message: "Event not found",
			});
		}
		const user = req.user;
		if (!user) {
			return res.status(404).json({
				status: "error",
				message: "User not found",
			});
		}
		user.likedEvents.push(eventID);
		user.save();
		res.sendStatus(200);
	} catch (error) {
		console.error("Error in likeEvent:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to like event",
			error: error.message,
		});
	}
});

const unlikeEvent = asyncHandler(async (req, res) => {
	const { id: eventID } = req.params;

	try {
		const event = await Event.findById(eventID)?.select("_id")?.lean();
		if (!event) {
			return res.status(404).json({
				status: "error",
				message: "Event not found",
			});
		}
		const user = req.user;
		if (!user) {
			return res.status(404).json({
				status: "error",
				message: "User not found",
			});
		}
		user.likedEvents = user.likedEvents.filter((id) => id != eventID);
		user.save();
		res.sendStatus(200);
	} catch (error) {
		console.error("Error in unlikeEvent:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to unlike event",
			error: error.message,
		});
	}
});

const getAllLikedEvents = asyncHandler(async (req, res) => {
	try {
		if (!req.user) {
			return res.status(404).json({
				status: "error",
				message: "User not found",
			});
		}
		res.status(200).json({
			status: "success",
			likedEvents: req.user.likedEvents,
		});
	} catch (error) {
		console.error("Error in getAllLikedEvents:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to fetch liked events",
			error: error.message,
		});
	}
});

const addEvent = asyncHandler(async (req, res) => {
	try {
		if (validateEvent(req.body)) {
			const event = await Event.create(req.body);
			res.status(201).json(event);
		}
	} catch (error) {
		console.error("Error in addEvent:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to add event",
			error,
		});
	}
});

const deleteSpecificEvent = asyncHandler(async (req, res) => {
	const session = await Event.startSession();
	session.startTransaction();

	try {
		const event = await Event.findById(req.params.eventId).session(session);
		if (!event) {
			await session.abortTransaction();
			session.endSession();
			return res.status(404).json({
				status: "error",
				message: "Event not found",
			});
		}

		await Event.findByIdAndDelete(req.params.eventId).session(session);
		await session.commitTransaction();
		session.endSession();

		res.status(200).json({
			status: "success",
			message: "Event deleted successfully",
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error("Error in deleteSpecificEvent:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to delete event",
			error,
		});
	}
});
const reqEventt = asyncHandler(async (req, res) => {
	try {
		const { Name, Email, Phone, isSlotted, isTeamEvent, isPaid, date } = req.body;

		if (!Name || !Email || !Phone || isSlotted === undefined || !date) {
			return res.status(400).json({ error: "All required fields must be provided." });
		}

		const newEvent = new reqEvent({
			Name,
			Email,
			Phone,
			isSlotted,
			isTeamEvent: isTeamEvent || false,
			isPaid: isPaid || false,
			date
		});

		await newEvent.save();
		res.status(201).json({ message: "Event requested successfully", event: newEvent });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
});


module.exports = {
	createEvent,
	getEvents,
	getEventById,
	likeEvent,
	unlikeEvent,
	getAllLikedEvents,
	addEvent,
	deleteSpecificEvent,
	reqEventt,
};
