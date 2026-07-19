module.exports.validateEmail = function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
module.exports.validateRollNumber = function validateRollNumber(rollNumber) {
    const rollNumberRegex = /^[0-9]{9}$/;
    return rollNumberRegex.test(rollNumber);
}
module.exports.validatePhoneNumber = function validatePhoneNumber(phoneNumber) {
    const phoneNumberRegex = /^[0-9]{10}$/;
    return phoneNumberRegex.test(phoneNumber);
}
module.exports.validateDriveYoutubeLink = function validateDriveYoutubeLink(link) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/.*|youtu\.be\/.*)$/;
    const driveRegex = /^https?:\/\/drive\.google\.com\/.*\/d\/.*$/;
    if (youtubeRegex.test(link) || driveRegex.test(link)) {
        return true;
    } else {
        return false;
    }
}

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
