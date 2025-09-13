const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegistrationSchema = new Schema(
  {
    teamName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    contactEmail: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, 'Please provide a valid email address'],
    },
    contactPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[+]?[(]?\d{1,4}[)]?[-\s.]?\d{3,}([-.\s]?\d{2,})*$/, 'Please provide a valid phone number'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Registration', RegistrationSchema);
