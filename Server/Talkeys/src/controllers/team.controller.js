const asyncHandler = require("express-async-handler");
const { sendMail } = require("../helpers/email.service");
const TeamSchema = require("../models/teams.model.js");
const { validateEmail, validatePhoneNumber, } = require("../helpers/validatorHelper");
const createTeam = asyncHandler(async (req, res) => {
    try {
        const { teamName, teamLeader, newPhoneNumber } = req.body;
        const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const team = new TeamSchema({
            teamName,
            teamLeader,
            teamCode,
            teamMembers: [teamLeader]
        });

        if (!validatePhoneNumber(newPhoneNumber)) {
            res.status(400);
            throw new Error("Invalid phone number");
        }

        const user = await UserSchema.findById(teamLeader);
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

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
        const { teamCode, userId, PhoneNumber } = req.body;

        const team = await TeamSchema.findOne({ teamCode });
        if (!team) {
            res.status(404);
            throw new Error("Team not found");
        }
        if (team.teamMembers.length >= team.maxMembers) {
            res.status(400);
            throw new Error("Team is full");
        }
        
        if (!validatePhoneNumber(PhoneNumber)) {
            res.status(400);
            throw new Error("Invalid phone number");
        }

        const user = await UserSchema.findById(userId);
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }
        user.phoneNumber = PhoneNumber;
        await user.save();


        team.teamMembers.push(userId);
        await team.save();
        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports={
    createTeam,
    joinTeam,

}