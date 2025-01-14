const asyncHandler = require("express-async-handler");
const Event = require("../models/events.model.js");
const Pass = require("../models/passes.model.js");
const { sendMail } = require("../../helpers/email.service");
const { validateEmail, validatePhoneNumber } = require("../../helpers/validatorHelper");

const createEvent = asyncHandler(async (req, res) => {
    try {
        const {
            eventName,
            category,
            mode,
            location,
            duration,
            ticketPrice,
            totalSeats,
            visibility,
            prizes,
            photographs,
            startDate,
            startTime,
            endRegistrationDate,
            eventDescription,
        } = req.body;
        const event = new Event({
            eventName,
            category,
            mode,
            location,
            duration,
            ticketPrice,
            totalSeats,
            visibility,
            prizes,
            photographs,
            startDate,
            startTime,
            endRegistrationDate,
            eventDescription,
        });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

module.exports.createEvent