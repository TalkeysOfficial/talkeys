// File: controllers/dashboard.controller.js
const User = require("../models/users.model");
const Event = require("../models/events.model");
const Pass = require("../models/passes.model");
const { Parser } = require("json2csv");
const Joi = require("joi");
const mongoose = require("mongoose");

exports.getProfile = async (req, res) => {
  const { accessToken, refreshToken, __v, ...safeUser } = req.user.toObject();
  res.json(safeUser);
};

exports.updateProfile = async (req, res) => {
  const allowed = ["displayName", "about", "pronouns", "avatarUrl"];
  allowed.forEach(k => {
    if (req.body[k] !== undefined) req.user[k] = req.body[k];
  });
  await req.user.save();
  res.json({ status: "success", user: req.user });
};

exports.userEvents = async (req, res) => {
  const { type = "registered", status, period = "1m" } = req.query;
  let events = [];

  if (type === "registered") {
    const passes = await Pass.find({ userId: req.user._id, status: "active" })
                             .populate("eventId");
    events = passes.map(p => p.eventId);
  }

  if (type === "bookmarked") {
    events = await Event.find({ _id: { $in: req.user.likedEvents } });
  }

  if (type === "hosted") {
    const days = { "1m": 30, "6m": 180, "1y": 365 }[period] ?? 30;
    const since = new Date(Date.now() - days * 86_400_000);
    const query = { organiserId: req.user._id, startDate: { $gte: since } };
    if (status === "past") query.startDate.$lt = new Date();
    if (status === "upcoming") query.startDate.$gte = new Date();
    events = await Event.find(query);
  }

  res.json({ events });
};

exports.recentActivity = async (req, res) => {
  const { range = "1m" } = req.query;
  const days = { "1m": 30, "6m": 180, "1y": 365 }[range] ?? 30;
  const since = new Date(Date.now() - days * 86_400_000);

  const passes = await Pass.find({
    userId: req.user._id,
    activatedAt: { $gte: since }
  }).populate("eventId");

  res.json({
    eventsAttended: passes.map(p => p.eventId),
    communitiesJoined: []
  });
};

// ---------------------- EVENT ORGANIZER EXTENSIONS ---------------------- //


// ---------------------------------------------
// Joi Schemas for Validation
// ---------------------------------------------

const baseEventSchema = {
  isTeamEvent: Joi.boolean(),
  isPaid: Joi.boolean(),
  isLive: Joi.boolean(),
  name: Joi.string().trim().min(3).max(100).required(),
  category: Joi.string().trim().max(50).required(),
  ticketPrice: Joi.number().min(0),
  mode: Joi.string().valid("offline", "online").required(), // since model only supports 2 values
  location: Joi.string().trim().allow(""),
  duration: Joi.string().required(),
  slots: Joi.number().min(0),
  visibility: Joi.string().valid("public", "private").required(),
  startDate: Joi.date().required(),
  startTime: Joi.string().required(),
  endRegistrationDate: Joi.date().required(),
  totalSeats: Joi.number().min(0).required(),
  photographs: Joi.array().items(Joi.string().uri()).optional(),
  prizes: Joi.string().allow(""),
  eventDescription: Joi.string().allow(""),
  paymentQRcode: Joi.string().uri().allow(""),
  registrationLink: Joi.string().uri().allow(""),
  sponserImages: Joi.array().items(Joi.string().uri()).optional(),
  organizerContact: Joi.string().pattern(/^[0-9]{10}$/).allow(""),
};

const createEventSchema = Joi.object(baseEventSchema);

const editEventSchema = Joi.object(
  Object.fromEntries(Object.entries(baseEventSchema).map(([k, v]) => [k, v.optional()]))
);

// ---------------------------------------------
// Controller: Create Event
// ---------------------------------------------

exports.createEvent = async (req, res) => {
  try {
    const { error, value } = createEventSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const event = new Event({
      ...value,
      organizerName: req.user.name,
      organizerEmail: req.user.email,
      organiserId: req.user._id,
    });

    await event.save();
    res.status(201).json({ message: "Event created", event });
  } catch (err) {
    res.status(500).json({ message: "Failed to create event", error: err.message });
  }
};

// ---------------------------------------------
// Controller: Edit Event
// ---------------------------------------------

exports.editEvent = async (req, res) => {
  try {
    const eventId = req.params.id.trim();
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid Event ID" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerEmail !== req.user.email) {
      return res.status(403).json({ message: "You are not allowed to edit this event" });
    }

    const { error, value } = editEventSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    Object.assign(event, value);
    await event.save();

    res.json({ message: "Event updated successfully", event });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// ---------------------------------------------
// Controller: View Participants
// ---------------------------------------------

exports.viewParticipants = async (req, res) => {
  try {
    const eventId = req.params.id.trim();
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid Event ID" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerEmail !== req.user.email) {
      return res.status(403).json({ message: "Access denied" });
    }

    const passes = await Pass.find({ eventId }).populate("userId", "name email phoneNumber");

    res.json({ participants: passes });
  } catch (err) {
    res.status(500).json({ message: "Error loading participants", error: err.message });
  }
};

// ---------------------------------------------
// Controller: Approve Participant
// ---------------------------------------------

exports.approveParticipant = async (req, res) => {
  try {
    const passId = req.params.id.trim();
    if (!mongoose.Types.ObjectId.isValid(passId)) {
      return res.status(400).json({ message: "Invalid Pass ID" });
    }

    const pass = await Pass.findById(passId).populate("eventId");
    if (!pass) return res.status(404).json({ message: "Participant not found" });

    if (pass.eventId.organizerEmail !== req.user.email) {
      return res.status(403).json({ message: "Access denied" });
    }

    pass.status = "active";
    await pass.save();

    res.json({ message: "Participant approved", pass });
  } catch (err) {
    res.status(500).json({ message: "Approval failed", error: err.message });
  }
};

// ---------------------------------------------
// Controller: Export Participants
// ---------------------------------------------

exports.exportParticipants = async (req, res) => {
  try {
    const eventId = req.params.id.trim();
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid Event ID" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerEmail !== req.user.email) {
      return res.status(403).json({ message: "Access denied" });
    }

    const passes = await Pass.find({ eventId }).populate("userId", "name email phoneNumber");

    const data = passes.map(p => ({
      name: p.userId.name,
      email: p.userId.email,
      phone: p.userId.phoneNumber,
      status: p.status,
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("participants.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Export failed", error: err.message });
  }
};

// ---------------------------------------------
// Controller: Get Analytics
// ---------------------------------------------

exports.getAnalytics = async (req, res) => {
  try {
    const eventId = req.params.id.trim();
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid Event ID" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerEmail !== req.user.email) {
      return res.status(403).json({ message: "Access denied" });
    }

    const total = await Pass.countDocuments({ eventId });
    const approved = await Pass.countDocuments({ eventId, status: "active" });

    res.json({ totalRegistrations: total, approvedCount: approved });
  } catch (err) {
    res.status(500).json({ message: "Analytics failed", error: err.message });
  }
};
