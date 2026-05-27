const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const teamSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    teamCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamMembers: {
      type: [teamMemberSchema],
      default: [],
    },
    maxMembers: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true },
);

teamSchema.index({ eventId: 1, teamName: 1 }, { unique: true });

module.exports = mongoose.model("Team", teamSchema);
