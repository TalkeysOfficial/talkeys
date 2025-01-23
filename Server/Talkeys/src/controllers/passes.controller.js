const asyncHandler = require("express-async-handler");
const { sendMail } = require("../helpers/email.service");
const TeamSchema = require("../models/teams.model.js");
const {
	validateEmail,
	validatePhoneNumber,
} = require("../helpers/validatorHelper");
const express = require("express");
const auth = require("../middleware/oauth.js");
const Event = require("../models/events.model.js");
const Pass = require("../models/passes.model.js");
const mongoose = require("mongoose");
const userSchema = require("../models/users.model.js");
const bookTicket = async (req, res) => {
    const { eventId } = req.body;
    const userId = req.user.id;

    try {
        // Find event
        const event = await Event.findById(eventId)
            .where('isLive').equals(true);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Find team of the user
        const team = await TeamSchema.findOne({ 
            teamLeader: userId,
            teamMembers: { $exists: true, $not: { $size: 0 } }
        })
        .populate('teamMembers')
        .populate('teamLeader');

        if (!team) {
            return res.status(403).json({ error: "No team found or you are not the team leader" });
        }

        // Check ticket availability
        if (event.availableTickets < team.teamMembers.length || !event.isBooking) {
            return res.status(400).json({ error: "Insufficient tickets available" });
        }

        // Start mongoose session for transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Check if any team member already has a pass
            const existingPasses = await Pass.find({
                userId: { $in: team.teamMembers.map(m => m._id) },
                eventId: event._id
            });

            if (existingPasses.length > 0) {
                await session.abortTransaction();
                return res.status(400).json({ 
                    error: "Some team members already have passes for this event" 
                });
            }

            // Create pass for entire team
            const teamPasses = team.teamMembers.map(member => ({
                eventId: event._id,
                userId: member._id,
                passType: 'Team',
                status: 'active'
            }));

            await Pass.create(teamPasses, { session });

            // Update event tickets
            const updatedEvent = await Event.findByIdAndUpdate(
                event._id,
                { 
                    $inc: { availableTickets: -team.teamMembers.length },
                    $push: { bookedTeams: team._id }
                },
                { session, new: true }
            );

            await session.commitTransaction();

            return res.status(200).json({
                message: "Team tickets booked successfully",
                teamMembers: team.teamMembers.length,
                remainingTickets: updatedEvent.availableTickets
            });

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('Ticket booking error:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getPassByUserAndEvent = async (userId, eventId) => {
    try {
        return await Pass.findOne({ 
            userId: user._id, 
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
