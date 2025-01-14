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
    const { name, slotId } = req.body;
    const userId = req.user.id;  // Assuming auth middleware adds user to request

    // Validate required fields
    if (!name) {
        return res.status(400).json({ error: "Event name is required" });
    }
    
    // Start session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find event
        const event = await Event.findOne({
            name: name,
            isLive: true,
        }).session(session);

        if (!event) {
            await session.abortTransaction();
            return res.status(404).json({ error: "Event not found" });
        }

        // Check if user already has a ticket
        const existingPass = await Pass.findOne({
            eventId: event._id,
            userId: userId
        }).session(session);

        if (existingPass) {
            await session.abortTransaction();
            return res.status(400).json({ error: "User already has a booked ticket" });
        }

        // Check ticket availability
        if (event.totalSeats <= 0 || !event.isBooking) {
            await session.abortTransaction();
            return res.status(400).json({ error: "No tickets available for this event" });
        }

        // Create new pass
        const newPass = await Pass.create([{
            eventId: event._id,
            userId: userId,
            passType: 'General', // Adjust based on your requirements
            status: 'active'
        }], { session });

        // Update available tickets
        await Event.findByIdAndUpdate(
            event._id,
            { $inc: { availableTickets: -1 } },
            { session, new: true }
        );

        // Commit transaction
        await session.commitTransaction();

        // Get updated event
        const updatedEvent = await Event.findById(event._id);
        return res.status(200).json({
            message: "Ticket booked successfully",
            user: req.user, // Assuming user details are in req.user
            event: {
                name: updatedEvent.name,
                availableTickets: updatedEvent.availableTickets
            }
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Error booking ticket:', error);
        return res.status(500).json({ error: "Internal server error" });
    } finally {
        session.endSession();
    }
};

module.exports = {
    bookTicket,
};