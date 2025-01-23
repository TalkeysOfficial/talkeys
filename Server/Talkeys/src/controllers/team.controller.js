const asyncHandler = require("express-async-handler");
const { sendMail } = require("../helpers/email.service");
const Team = require("../models/teams.model.js");
const {
	validateEmail,
	validatePhoneNumber,
} = require("../helpers/validatorHelper");
const Event = require("../models/events.model.js");
const User = require("../models/users.model.js");
const { model } = require("mongoose");

const createTeam = asyncHandler(async (req, res) => {
	try {
		const { teamName, newPhoneNumber, eventId } = req.body;
		const userEmail = req.user.email;
		// Find the event first
		/* The line `const currentEvent = await model({ eventName });` is attempting to find a model
        instance based on the provided `eventName`. However, there seems to be a mistake in the code
        as `model` is not defined in the code snippet you provided. */
		const currentEvent = await Event.findById(eventId);
		console.log("Debug: Event found");
		console.log(currentEvent);
		if (!currentEvent) {
			return res.status(404).json({ message: "Event not found" });
		}

		const user = await User.findOne({ email: userEmail });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase();

		const team = new Team({
			teamName,
			teamLeader: user._id,
			teamCode,
			eventName: currentEvent._id,
			teamMembers: [user._id],
		});
		console.log("Debug: Team created");
		user.phoneNumber = newPhoneNumber;
		await user.save();
		await team.save();

		res.status(201).json({ team, teamCode });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
const joinTeam = asyncHandler(async (req, res) => {
	try {
		const { teamCode, phoneNumber } = req.body;
		const userEmail = req.user.email;

		// Validate the phone number
		if (!validatePhoneNumber(phoneNumber)) {
			return res.status(400).json({ message: "Invalid phone number" });
		}

		// Fetch the user
		const user = await User.findOne({ email: userEmail });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Fetch the team using teamCode
		const team = await TeamSchema.findOne({ teamCode }).populate(
			"teamMembers",
		);
		if (!team) {
			return res.status(404).json({ message: "Team not found" });
		}

		// Check if user is already part of the team
		if (team.teamMembers.some((member) => member._id.equals(user._id))) {
			return res.status(400).json({ message: "User already in team" });
		}

		// Ensure the team is not full
		if (team.teamMembers.length >= team.maxMembers) {
			return res.status(400).json({ message: "Team is full" });
		}

		// Update user's phone number if different
		if (user.phoneNumber !== phoneNumber) {
			user.phoneNumber = phoneNumber;
			await user.save();
		}

		// Add user to the team
		team.teamMembers.push(user._id);
		await team.save();

		res.status(200).json({
			message: "Successfully joined the team",
			team,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});
const getTeam = asyncHandler(async (req, res) => {
	try {
		const userEmail = req.user.email;
		const eventId = req.body?.eventId;

		const user = await User.findOne({ email: userEmail });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const teams = await Team.find({ eventName: eventId });
		const userTeam = teams.find((team) =>
			team.teamMembers.some((member) => member.equals(user._id)),
		);

		if (!userTeam) {
			return res.status(404).json({
				message: "No team found for this user in the specified event",
			});
		}

		return res.status(200).json(userTeam);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = {
	createTeam,
	joinTeam,
	getTeam,
};
