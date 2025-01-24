const asyncHandler = require("express-async-handler");
const { sendMail } = require("../helpers/email.service");
const TeamSchema = require("../models/teams.model.js");
const express = require("express");
const auth = require("../middleware/oauth.js");
const Event = require("../models/events.model.js");
const Pass = require("../models/passes.model.js");
const mongoose = require("mongoose");


const bookTicket = async (req, res) => {
    // Validate input
    if (!req.body.teamCode || !req.body.eventId) {
        return res.status(400).json({ error: "Invalid request parameters" });
    }

    const { teamCode, eventId } = req.body;
    const userId = req.user._id;

    try {
        // Find team and populate team members and team leader
        const team = await TeamSchema.findOne({ teamCode: teamCode })
            .populate('teamMembers')
            .populate('teamLeader');

        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }

        // Check if teamLeader is populated and is a valid ObjectId
        if (!team.teamLeader || !mongoose.Types.ObjectId.isValid(team.teamLeader._id)) {
            return res.status(404).json({ error: "Team leader not found or invalid" });
        }
        console.log("===================")
        console.log(team)

        // Check if the user is the team leader
        // if (userId != team.teamLeader) {
        //     return res.status(403).json({ error: "Only team leader can book tickets" });
        // }

        // Find event
        const event = await Event.findOne({
            _id: eventId,
            isLive: true,
        });

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
console.log("Debug: Event found")
        // Check ticket availability
        if (event.totalSeats < 0) {
            return res.status(400).json({ error: "Insufficient tickets available" });
        }

        // Check if any team member already has a pass
        const existingPasses = await Pass.find({
            userId,
            eventId: event._id,
        });

        if (existingPasses.length > 0) {
            return res.status(400).json({
                error: "Some team members already have passes for this event",
            });
        }
        // Create pass for entire team
        const teamPasses = team.teamMembers.map((member) => ({
            userId: member._id,
            eventId: event._id,
            passType: "General",
        }));
        
        await Promise.all(teamPasses.map(pass => Pass.create(pass)));
        console.log("fuck!!!")

        // Update event tickets
        const updatedEvent = await Event.findByIdAndUpdate(
            event._id,
            {
                $inc: { totalSeats: -team.teamMembers.length },
            },
            { new: true },
        );

        return res.status(200).json({
            message: "Team tickets booked successfully",
            teamMembers: team.teamMembers.length,
            remainingTickets: updatedEvent.totalSeats,
        });
    } catch (error) {
        console.error("Ticket booking error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getPassByUserAndEvent = async (req, res) => {
    try {
        const pass = await Pass.findOne({ 
            userId: req.user._id, 
            eventId: req.body.eventId 
        }, '_id');
        if (!pass) {
            return res.status(404).json({ error: "Pass not found" });
        }

        return res.status(200).json(pass);
    } catch (error) {
        console.error('Get pass error:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getPassByUserAndEvent,
    bookTicket,
};