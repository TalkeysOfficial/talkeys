const asyncHandler = require("express-async-handler");
const { sendMail } = require("../helpers/email.service");
const TeamSchema = require("../models/teams.model.js");
const { validateEmail, validatePhoneNumber, } = require("../helpers/validatorHelper");
const {Event} = require("../models/events.model.js");
const User = require("../models/users.model.js"); // Ensure correct import path
const createTeam = asyncHandler(async (req, res) => {
    try {
        const { teamName, newPhoneNumber, } = req.body;
        const userEmail = req.user.email;
        // Debug logging
        console.log("User Email:", userEmail);
        const currentEvent = await Event.findOne({
            name: req.body.eventName
        });
        const user = await User.findOne({ email: userEmail });
        
        // More debug checks
        if (!User) {
            return res.status(500).json({ message: "User model not defined" });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const teamLeader = user._id;
        const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        if (!validatePhoneNumber(newPhoneNumber)) {
            return res.status(400).json({ message: "Invalid phone number" });
        }

        const team = new TeamSchema({
            teamName,
            teamLeader: user._id,
            teamCode,
            eventName: currentEvent._id,
            teamMembers: [user._id]
        });

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
        const event= req.body.eventName;
        // Debug logging

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const team = await TeamSchema.findOne({ teamCode });
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        if (team.teamMembers.length >= team.maxMembers) {
            return res.status(400).json({ message: "Team is full" });
        }
        
        if (!validatePhoneNumber(phoneNumber)) {
            return res.status(400).json({ message: "Invalid phone number" });
        }

        // Check if user is already in the team
        if (team.teamMembers.includes(user._id)) {
            return res.status(400).json({ message: "User already in team" });
        }

        user.phoneNumber = phoneNumber;
        await user.save();

        team.teamMembers.push(user._id);
        await team.save();

        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const getTeam = asyncHandler(async (req, res) => {
    try {
        const userEmail = req.user.email;
        const user = await User.findOne({ email: userEmail });
        const event= req.body.eventName;
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const team = await TeamSchema
            .findOne({ teamMembers: user._id ,
                eventName: event._id
            })
        
        if (!team) {
            return res.status(404).json({ message: "No team found for this user" });
        }

        return res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports={
    createTeam,
    joinTeam,
    getTeam

}