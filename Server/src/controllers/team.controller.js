const crypto = require("crypto");
const mongoose = require("mongoose");
const Event = require("../models/events.model");
const Team = require("../models/teams.model");

const normalizePhone = (phoneNumber = "") =>
  String(phoneNumber).replace(/[^\d+]/g, "").trim();

const toTeamDTO = (team) => ({
  _id: team._id,
  eventId: team.eventId,
  teamName: team.teamName,
  teamCode: team.teamCode,
  teamLeader: team.teamLeader,
  teamMembers: team.teamMembers,
  maxMembers: team.maxMembers,
});

const createTeamCode = () =>
  crypto.randomBytes(4).toString("hex").toUpperCase();

const makeMember = (user, phoneNumber) => ({
  userId: user._id,
  name: user.name,
  email: user.email,
  phoneNumber,
});

const getTeamCapacity = (event) => Math.max(Number(event.slots || 1), 1);

const createTeam = async (req, res) => {
  try {
    const { eventId, teamName } = req.body;
    const phoneNumber = normalizePhone(req.body.newPhoneNumber || req.body.phoneNumber);

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "Valid Event ID is required" });
    }

    if (!teamName || String(teamName).trim().length < 2) {
      return res.status(400).json({ error: "Team name is required" });
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      return res.status(400).json({ error: "Valid phone number is required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (!event.isTeamEvent) {
      return res.status(400).json({ error: "This event does not support team registration" });
    }

    const existingMembership = await Team.findOne({
      eventId,
      "teamMembers.userId": req.user._id,
    });
    if (existingMembership) {
      return res.status(400).json({ error: "User is already in a team for this event" });
    }

    let teamCode;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const candidate = createTeamCode();
      const exists = await Team.exists({ teamCode: candidate });
      if (!exists) {
        teamCode = candidate;
        break;
      }
    }

    if (!teamCode) {
      return res.status(500).json({ error: "Could not generate team code" });
    }

    const team = await Team.create({
      eventId,
      teamName: String(teamName).trim(),
      teamCode,
      teamLeader: req.user._id,
      teamMembers: [makeMember(req.user, phoneNumber)],
      maxMembers: getTeamCapacity(event),
    });

    return res.status(201).json({ team: toTeamDTO(team), teamCode: team.teamCode });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Team already exists for this event" });
    }

    console.error("Create team error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const joinTeam = async (req, res) => {
  try {
    const { teamCode } = req.body;
    const phoneNumber = normalizePhone(req.body.phoneNumber);

    if (!teamCode) {
      return res.status(400).json({ error: "Team code is required" });
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      return res.status(400).json({ error: "Valid phone number is required" });
    }

    const team = await Team.findOne({ teamCode: String(teamCode).trim().toUpperCase() });
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const alreadyInTeam = team.teamMembers.some(
      (member) => member.userId.toString() === req.user._id.toString(),
    );
    if (alreadyInTeam) {
      return res.status(200).json({ teamName: team.teamName, team: toTeamDTO(team) });
    }

    const existingMembership = await Team.findOne({
      eventId: team.eventId,
      "teamMembers.userId": req.user._id,
    });
    if (existingMembership) {
      return res.status(400).json({ error: "User is already in a team for this event" });
    }

    if (team.teamMembers.length >= team.maxMembers) {
      return res.status(400).json({ error: "Team is full" });
    }

    team.teamMembers.push(makeMember(req.user, phoneNumber));
    await team.save();

    return res.status(200).json({ teamName: team.teamName, team: toTeamDTO(team) });
  } catch (error) {
    console.error("Join team error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createTeam,
  joinTeam,
};
