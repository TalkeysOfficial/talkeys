const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for team members
const MemberSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Member name is required']
  },
  email: {
    type: String,
    required: [true, 'Member email is required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  college: {
    type: String,
    required: [true, 'College name is required']
  },
  role: {
    type: String,
    default: 'Member'
  }
});

// Define the main registration schema
const RegistrationSchema = new Schema({
  teamName: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    enum: ['Agritech', 'Edtech', 'Healthtech', 'Fintech', 'E-commerce', 'AI/ML', 'Cybersecurity', 'Open Domain']
  },
  members: {
    type: [MemberSchema],
    validate: {
      validator: function(members) {
        return members.length >= 2 && members.length <= 5;
      },
      message: 'Team must have between 2 and 5 members'
    },
    required: [true, 'Team members are required']
  },
  projectTitle: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  projectDescription: {
    type: String,
    required: [true, 'Project description is required']
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  contactPhone: {
    type: String,
    match: [/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Please provide a valid phone number']
  },
  proposalSubmitted: {
    type: Boolean,
    default: false
  },
  proposalUrl: {
    type: String
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Registration', RegistrationSchema);