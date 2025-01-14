const asyncHandler = require("express-async-handler");
const Event = require("../models/events.model.js");
const Pass = require("../models/passes.model.js");
const { validateEmail, validatePhoneNumber } = require("../helpers/validatorHelper");

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

exports.getEvents =  asyncHandler(async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'startDate',
            order = 'asc',
            mode,
            category,
            visibility,
            search,
            minPrice,
            maxPrice
        } = req.query;

        // Build query
        const query = {};

        // Add mode filter (online/offline)
        if (mode) {
            query.mode = mode;
        }

        // Add category filter
        if (category) {
            query.category = category;
        }

        // Add visibility filter
        if (visibility) {
            query.visibility = visibility;
        }

        // Add price range filter
        if (minPrice || maxPrice) {
            query.ticketPrice = {};
            if (minPrice) query.ticketPrice.$gte = Number(minPrice);
            if (maxPrice) query.ticketPrice.$lte = Number(maxPrice);
        }

        // Add search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { eventDescription: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        // Only show upcoming events (where registration hasn't ended)
        query.endRegistrationDate = { $gte: new Date() };

        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build sort object
        const sortOptions = {};
        sortOptions[sortBy] = order === 'desc' ? -1 : 1;

        // Execute query with pagination
        const events = await Event.find(query)
            .select('-__v')  // Exclude version key
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Get total count for pagination
        const total = await Event.countDocuments(query);

        // Calculate available seats for each event
        const eventsWithSeats = events.map(event => ({
            ...event,
            availableSeats: event.totalSeats // You'll need to subtract booked seats here when you implement booking
        }));

        res.status(200).json({
            status: 'success',
            data: {
                events: eventsWithSeats,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit)),
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Error in getEvents:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch events',
            error: error.message
        });
    }
});

// Helper function to get a single event
exports.getEventById = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId)
            .select('-__v')
            .lean();

        if (!event) {
            return res.status(404).json({
                status: 'error',
                message: 'Event not found'
            });
        }

        // Calculate available seats
        const availableSeats = event.totalSeats; // You'll need to subtract booked seats here when you implement booking

        res.status(200).json({
            status: 'success',
            data: {
                ...event,
                availableSeats
            }
        });

    } catch (error) {
        console.error('Error in getEventById:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch event',
            error: error.message
        });
    }
};
module.exports.createEvent