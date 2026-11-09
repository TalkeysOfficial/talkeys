
const { body } = require("express-validator");

module.exports.influencerValidation = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required"),

    body("instaId")
        .trim()
        .notEmpty().withMessage("Instagram ID is required"),

    body("phone")
        .trim()
        .matches(/^(\+91)?\d{10}$/).withMessage("Phone number must be 10 digits or start with +91 followed by 10 digits"),

    body("followersCount")
        .isInt({ min: 5000 }).withMessage("Followers count must be at least 5000"),

    body("attendance")
        .isIn(["yes", "no"]).withMessage("Attendance must be either 'yes' or 'no'")
];
