const Joi = require('joi');

exports.createRegistrationSchema = Joi.object({
  teamName: Joi.string().trim().required(),
  contactEmail: Joi.string().email().required(),
  contactPhone: Joi.string().trim().required(),
}).options({ abortEarly: false, allowUnknown: false }); // set to true if you want to accept extra fields
