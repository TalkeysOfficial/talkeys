const { body, validationResult } = require("express-validator");

module.exports.validateEmail = function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
module.exports.validateRollNumber = function validateRollNumber(rollNumber) {
  const rollNumberRegex = /^[0-9]{9}$/;
  return rollNumberRegex.test(rollNumber);
};
module.exports.validatePhoneNumber = function validatePhoneNumber(phoneNumber) {
  const phoneNumberRegex = /^[0-9]{10}$/;
  return phoneNumberRegex.test(phoneNumber);
};
module.exports.validateDriveYoutubeLink = function validateDriveYoutubeLink(link) {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/.*|youtu\.be\/.*)$/;
  const driveRegex = /^https?:\/\/drive\.google\.com\/.*\/d\/.*$/;
  return youtubeRegex.test(link) || driveRegex.test(link);
};

const influencerValidation = [
  body("teamName").trim().notEmpty().withMessage("Name is required"),
  body("contactEmail").isEmail().withMessage("Valid email is required"),
  body("contactPhone").trim().notEmpty().withMessage("Phone number is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports.influencerValidation = influencerValidation;
