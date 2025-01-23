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
    if (!req.user || !req.body.teamcode || !req.body.eventId) {
        return res.status(400).json({ error: "Invalid request parameters" });
    }

    const { teamcode, eventId } = req.body;
    const userId = req.user.id;

    try {
        // Find team and populate team members and team leader
        const team = await TeamSchema.findOne({ teamCode: teamcode })
            .populate('teamMembers')
            .populate('teamLeader');

        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }

        // Check if teamLeader is populated and is a valid ObjectId
        if (!team.teamLeader || !mongoose.Types.ObjectId.isValid(team.teamLeader._id)) {
            return res.status(404).json({ error: "Team leader not found or invalid" });
        }

        // Check if the user is the team leader
        if (userId.toString() !== team.teamLeader._id.toString()) {
            return res.status(403).json({ error: "Only team leader can book tickets" });
        }

        // Find event
        const event = await Event.findOne({
            _id: eventId,
            isLive: true,
        });

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Check ticket availability
        if (event.availableTickets < team.teamMembers.length || !event.isBooking) {
            return res.status(400).json({ error: "Insufficient tickets available" });
        }

        // Check if any team member already has a pass
        const existingPasses = await Pass.find({
            userId: { $in: team.teamMembers.map((m) => m._id) },
            eventId: event._id,
        });

        if (existingPasses) {
            return res.status(400).json({
                error: "Some team members already have passes for this event",
            });
        }

        // Create pass for entire team
        const teamPasses = team.teamMembers.map((member) => ({
            eventId: event._id,
            userId: member._id,
            passType: "Team",
            status: "active",
        }));

        await Pass.create(teamPasses);

        // Update event tickets
        const updatedEvent = await Event.findByIdAndUpdate(
            event._id,
            {
                $inc: { availableTickets: -team.teamMembers.length },
                $push: { bookedTeams: team._id },
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Team tickets booked successfully",
            teamMembers: team.teamMembers.length,
            remainingTickets: updatedEvent.availableTickets,
        });
    } catch (error) {
        console.error("Ticket booking error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getPassByUserAndEvent = async (userId, eventId) => {
    try {
        return await Pass.findOne({ 
            userId: userId, 
            eventId: eventId 
        }, '_id');
    } catch (error) {
        console.error('Get pass error:', error);
        throw error;
    }
};

module.exports = {
    getPassByUserAndEvent,
    bookTicket,
};