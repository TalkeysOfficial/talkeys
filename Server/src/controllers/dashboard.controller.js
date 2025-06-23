const User  = require("../models/users.model");
const Event = require("../models/events.model");
const Pass  = require("../models/passes.model");


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
