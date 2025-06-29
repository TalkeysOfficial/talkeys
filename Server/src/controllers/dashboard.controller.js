const User  = require("../models/users.model");
const Event = require("../models/events.model");
const Pass  = require("../models/passes.model");
const { Parser } = require("json2csv");


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

// event organizer routes
exports.createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      organizerEmail: req.user.email,
      createdAt: new Date(),
    });
    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    res.status(500).json({ message: "Failed to create event", error: err.message });
  }
};

exports.editEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerEmail !== req.user.email) {
      return res.status(403).json({ message: "You are not allowed to edit this event" });
    }

    Object.assign(event, req.body);
    await event.save();
    res.json({ message: "Event updated successfully", event });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

exports.manageEventDetails = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerEmail !== req.user.email) {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(event, { schedules: req.body.schedules, deadlines: req.body.deadlines });
    await event.save();
    res.json({ message: "Event details updated successfully", event });
  } catch (err) {
    res.status(500).json({ message: "Failed to update event details", error: err.message });
  }
};

exports.viewParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerEmail !== req.user.email) {
      return res.status(403).json({ message: "Access denied" });
    }

    const participants = await Pass.find({ eventId: req.params.id })
      .populate("userId", "name email phoneNumber");
    res.json({ participants });
  } catch (err) {
    res.status(500).json({ message: "Error loading participants", error: err.message });
  }
};

exports.approveParticipant = async (req, res) => {
  try {
    const pass = await Pass.findById(req.params.id).populate("eventId");
    if (!pass) return res.status(404).json({ message: "Participant not found" });

    if (pass.eventId.organizerEmail !== req.user.email) {
      return res.status(403).json({ message: "Access denied" });
    }

    pass.status = "active";
    await pass.save();
    res.json({ message: "Participant approved successfully", pass });
  } catch (err) {
    res.status(500).json({ message: "Approval failed", error: err.message });
  }
};


exports.exportParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerEmail !== req.user.email) {
      return res.status(403).json({ message: "Access denied" });
    }

    const passes = await Pass.find({ eventId: req.params.id })
      .populate("userId", "name email phoneNumber");

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
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Export failed", error: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerEmail !== req.user.email) {
      return res.status(403).json({ message: "Access denied" });
    }

    const totalRegistrations = await Pass.countDocuments({ eventId: req.params.id });
    const approvedCount = await Pass.countDocuments({ eventId: req.params.id, status: "active" });

    res.json({ totalRegistrations, approvedCount });
  } catch (err) {
    res.status(500).json({ message: "Analytics failed", error: err.message });
  }
};


