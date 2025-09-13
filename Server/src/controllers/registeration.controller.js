const Registration = require('../models/registration.model');
const { createRegistrationSchema } = require('../schemas/registeration.schema');


exports.create = async (req, res) => {
  try {
    const { value, error } = createRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(d => d.message),
      });
    }

    const doc = await Registration.create(value);
    return res.status(201).json({ success: true, data: doc });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
