const asyncHandler = require("express-async-handler");
const { sendMail } = require("../helpers/email.service");
const TeamSchema = require("../models/teams.model.js");
const { validateEmail, validatePhoneNumber, } = require("../helpers/validatorHelper");
const express = require('express');
const auth = require('../middleware/oauth.js');
const Event = require('../models/events.model.js');
const Pass = require('../models/passes.model.js');
const mongoose = require('mongoose');

const bookTicket = async (req, res) => {
    const { teamcode, name } = req.body;
    const userId = req.user.id;

    try {
        // Validate team and leadership
        const team = await TeamSchema.findOne({ teamCode: teamcode });
        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }
        if (userId.toString() !== team.teamLeader.toString()) {
            return res.status(403).json({ error: "Only team leader can book tickets" });
        }

        // Find event
        const event = await Event.findOne({
            name: name,
            isLive: true,
        });

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Check ticket availability
        if (event.availableTickets <= 0 || !event.isBooking) {
            return res.status(400).json({ error: "No tickets available" });
        }

        // Start mongoose session for transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Create pass for entire team
            const teamPasses = team.teamMembers.map(memberId => ({
                eventId: event._id,
                userId: memberId,
                passType: 'Team',
                status: 'active'
            }));

            await Pass.create(teamPasses, { session });

            // Update event tickets
            await Event.findByIdAndUpdate(
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
                remainingTickets: event.availableTickets - team.teamMembers.length
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

const Pass = require('../models/passes.model.js');

const getPassByUserAndEvent = async (userId, eventId) => {
    try {
        const pass = await Pass.findOne({ 
            userId: userId, 
            eventId: eventId 
        }, '_id');  // Explicitly select only the _id field

        return pass ? pass._id : null;
    } catch (error) {
        console.error('Get pass error:', error);
        throw error;
    }
};

module.exports = {
    getPassByUserAndEvent,
    bookTicket
};