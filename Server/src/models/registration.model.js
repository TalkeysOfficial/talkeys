const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegistrationSchema = new Schema(
  {
    teamName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    domain: {
      type: String,
      required: [true, 'Insta id is required'],
      trim: true,
      match: [/^@?[A-Za-z0-9._]{1,30}$/, 'Please provide a valid Instagram handle'],
      set: v => (typeof v === 'string' ? v.trim() : v),
    },
    members: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    projectTitle: {
      type: Number,
      required: [true, 'Follower count is required'],
      min: [0, 'Follower count cannot be negative'],
    },
    projectDescription: {
      type: String,
      required: [true, 'Attendance selection is required'],
      enum: ['Yes', 'No', 'Maybe'],
    },
    contactEmail: {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Please provide a valid email address'],
      trim: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[+]?[(]?\d{1,4}[)]?[-\s.]?\d{3,}([-.\s]?\d{2,})*$/, 'Please provide a valid phone number'],
      trim: true,
    },
    proposalSubmitted: {
      type: Boolean,
      default: false,
    },
    proposalUrl: {
      type: String,
      trim: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Registration', RegistrationSchema);
