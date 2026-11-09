const mongoose = require("mongoose");

const InfluencerRegistrationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        instaId: {
            type: String,
            required: [true, "Instagram ID is required"],
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
            match: [/^(\+91)?\d{10}$/, "Phone number must be 10 digits or start with +91"],
        },
        followersCount: {
            type: Number,
            required: [true, "Followers count is required"],
            min: [5000, "Followers count must be at least 5000"],
        },
        attendance: {
            type: String,
            required: [true, "Attendance is required"],
            enum: ["yes", "no"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "InfluencerRegistration",
    InfluencerRegistrationSchema
);
