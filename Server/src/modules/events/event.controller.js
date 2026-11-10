const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Event = require("./events.model.js");
const reqEvent = require("./reqEvent.model.js");
const { validateEvent } = require("./event.schema.js");
const { validationResult } = require("express-validator");
const InfluencerRegistration = require("./InfluencerRegistration.model.js");
const {
	listPublicEvents,
	listAdminEvents,
	getPublicEventById,
	getEventPassTypes,
	getLikeCountForEvent,
	applyTicketPriceCompatibility,
} = require("./events.service.js");


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

const getEvents = asyncHandler(async (req, res) => {
	try {
		res.status(200).json({ status: "success", data: await listPublicEvents(req.query) });
	} catch (error) {
		console.error("Error in getEvents:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to fetch events",
			error: error.message,
		});
	}
});

const getAdminEvents = asyncHandler(async (req, res) => {
	try {
		res.status(200).json({ status: "success", data: await listAdminEvents(req.query) });
	} catch (error) {
		console.error("Error in getAdminEvents:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to fetch admin events",
			error: error.message,
		});
	}
});

const getEventById = async (req, res) => {
	try {
		const data = await getPublicEventById(req.params.id);
		if (!data) {
			return res.status(404).json({
				status: "error",
				message: "Event not found",
			});
		}
		res.status(200).json({ status: "success", data });
	} catch (error) {
		console.error("Error in getEventById:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to fetch event",
			error: error.message,
		});
	}
};

const getAdminEventById = asyncHandler(async (req, res) => {
	try {
		const { eventId } = req.params;
		if (!mongoose.Types.ObjectId.isValid(eventId)) {
			return res.status(400).json({
				status: "error",
				message: "Invalid Event ID",
			});
		}

		const event = await Event.findById(eventId).select("-__v");
		if (!event) {
			return res.status(404).json({
				status: "error",
				message: "Event not found",
			});
		}

		res.status(200).json({
			status: "success",
			data: {
				...event.toObject(),
				availableSeats: event.totalSeats - (event.registrationCount || 0),
				likes: await getLikeCountForEvent(event._id),
				passTypes: getEventPassTypes(event),
			},
		});
	} catch (error) {
		console.error("Error in getAdminEventById:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to fetch event",
			error: error.message,
		});
	}
});

const likeEvent = asyncHandler(async (req, res) => {
	const { id: eventID } = req.params;

	try {
		if (!mongoose.Types.ObjectId.isValid(eventID)) {
			return res.status(400).json({
				status: "error",
				message: "Invalid event ID",
			});
		}

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
		const alreadyLiked = user.likedEvents.some(
			(id) => id.toString() === eventID,
		);

		if (!alreadyLiked) {
			user.likedEvents.push(event._id);
			await user.save();
		}

		const likes = await getLikeCountForEvent(eventID);
		res.status(200).json({
			status: "success",
			liked: true,
			likes,
		});
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
		if (!mongoose.Types.ObjectId.isValid(eventID)) {
			return res.status(400).json({
				status: "error",
				message: "Invalid event ID",
			});
		}

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
		user.likedEvents = user.likedEvents.filter(
			(id) => id.toString() !== eventID,
		);
		await user.save();

		const likes = await getLikeCountForEvent(eventID);
		res.status(200).json({
			status: "success",
			liked: false,
			likes,
		});
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
		const validation = validateEvent(req.body);
		if (!validation.success) {
			return res.status(400).json({
				status: "error",
				message: validation.message,
				errors: validation.errors,
			});
		}

		const event = await Event.create({
			...applyTicketPriceCompatibility(validation.data),
			organiserId: req.user?._id,
		});

		res.status(201).json({
			status: "success",
			message: "Event added successfully",
			data: event,
		});
	} catch (error) {
		console.error("Error in addEvent:", error);
		if (error.name === "ValidationError") {
			return res.status(400).json({
				status: "error",
				message: error.message,
			});
		}
		res.status(500).json({
			status: "error",
			message: "Failed to add event",
			error: error.message,
		});
	}
});

const updateEvent = asyncHandler(async (req, res) => {
	try {
		const { eventId } = req.params;
		const lastKnownUpdatedAt = req.body?.lastKnownUpdatedAt;

		if (!mongoose.Types.ObjectId.isValid(eventId)) {
			return res.status(400).json({
				status: "error",
				message: "Invalid Event ID",
			});
		}

		const validation = validateEvent(req.body, { partial: true });

		if (!validation.success) {
			return res.status(400).json({
				status: "error",
				message: validation.message,
				errors: validation.errors,
			});
		}

		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({
				status: "error",
				message: "Event not found",
			});
		}

		if (
			lastKnownUpdatedAt &&
			new Date(lastKnownUpdatedAt).getTime() !== new Date(event.updatedAt).getTime()
		) {
			return res.status(409).json({
				status: "error",
				message: "This event was updated by someone else. Refresh before saving again.",
			});
		}

		Object.assign(event, applyTicketPriceCompatibility(validation.data));
		await event.save();

		res.status(200).json({
			status: "success",
			message: "Event updated successfully",
			data: event,
		});
	} catch (error) {
		console.error("Error in updateEvent:", error);
		if (error.name === "ValidationError") {
			return res.status(400).json({
				status: "error",
				message: error.message,
			});
		}
		res.status(500).json({
			status: "error",
			message: "Failed to update event",
			error: error.message,
		});
	}
});

const deleteSpecificEvent = asyncHandler(async (req, res) => {
	try {
		const { eventId } = req.params;
		if (!mongoose.Types.ObjectId.isValid(eventId)) {
			return res.status(400).json({
				status: "error",
				message: "Invalid Event ID",
			});
		}

		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({
				status: "error",
				message: "Event not found",
			});
		}

		await Event.findByIdAndDelete(eventId);

		res.status(200).json({
			status: "success",
			message: "Event deleted successfully",
		});
	} catch (error) {
		console.error("Error in deleteSpecificEvent:", error);
		res.status(500).json({
			status: "error",
			message: "Failed to delete event",
			error: error.message,
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


const registerForInfluencer = asyncHandler(async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, instaId, phone, followersCount, attendance } = req.body;

		const newRegistration = await InfluencerRegistration.create({
			name,
			instaId,
			phone,
			followersCount,
			attendance,
			userId: req.user._id,
		});

		res.status(201).json({
			message: "Registration successful",
			registration: newRegistration,
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			message: "Registration failed",
			error: error.message,
		});
	}
});



module.exports = {
	createEvent,
	getEvents,
	getAdminEvents,
	getEventById,
	getAdminEventById,
	likeEvent,
	unlikeEvent,
	getAllLikedEvents,
	addEvent,
	updateEvent,
	deleteSpecificEvent,
	reqEventt,
	registerForInfluencer,
};
