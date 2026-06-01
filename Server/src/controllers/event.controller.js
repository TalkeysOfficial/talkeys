const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Event = require("../models/events.model.js");
const reqEvent = require("../models/reqEvent.model.js");
const { validateEvent } = require("../schemas/event.schema.js");
const { validationResult } = require("express-validator");
const InfluencerRegistration = require("../models/InfluencerRegistration.model.js");


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
			limit,
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

		const sortOptions = { [sortBy]: order === "desc" ? -1 : 1 };
		const parsedLimit = limit !== undefined ? parseInt(limit, 10) : null;
		const shouldPaginate = Number.isFinite(parsedLimit) && parsedLimit > 0;
		const skip = shouldPaginate ? (parseInt(page, 10) - 1) * parsedLimit : 0;

		let events = await Event.find(query)
			.select("-__v")
			.sort(sortOptions)
			.skip(skip)
			.limit(shouldPaginate ? parsedLimit : 0);

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
				status: event.getStatus(),
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
					pages: shouldPaginate ? Math.ceil(total / parsedLimit) : 1,
					limit: shouldPaginate ? parsedLimit : total,
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

const getAdminEvents = asyncHandler(async (req, res) => {
	try {
		const {
			page = 1,
			limit = 200,
			sortBy = "createdAt",
			order = "desc",
			search = "",
		} = req.query;

		const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
		const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 200, 1), 500);
		const allowedSortFields = new Set(["createdAt", "updatedAt", "startDate", "name"]);
		const safeSortBy = allowedSortFields.has(sortBy) ? sortBy : "createdAt";

		const query = {};
		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ eventDescription: { $regex: search, $options: "i" } },
				{ category: { $regex: search, $options: "i" } },
			];
		}

		const skip = (parsedPage - 1) * parsedLimit;
		const sortOptions = { [safeSortBy]: order === "asc" ? 1 : -1 };
		const [events, total] = await Promise.all([
			Event.find(query)
				.select("-__v")
				.sort(sortOptions)
				.skip(skip)
				.limit(parsedLimit),
			Event.countDocuments(query),
		]);

		res.status(200).json({
			status: "success",
			data: {
				events: events.map((event) => ({
					...event.toObject(),
					availableSeats: event.totalSeats - (event.registrationCount || 0),
					status: event.getStatus(),
				})),
				pagination: {
					total,
					page: parsedPage,
					pages: Math.ceil(total / parsedLimit),
					limit: parsedLimit,
				},
			},
		});
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
				status: event.getStatus(),
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
		const validation = validateEvent(req.body);
		if (!validation.success) {
			return res.status(400).json({
				status: "error",
				message: validation.message,
				errors: validation.errors,
			});
		}

		const event = await Event.create({
			...validation.data,
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

		Object.assign(event, validation.data);
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
