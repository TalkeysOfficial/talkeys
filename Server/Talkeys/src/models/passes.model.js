const mongoose = require("mongoose");

const passSchema = new mongoose.Schema({
  isScanned: {
    type: Boolean,
    default: false, 
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  timeScanned: {
    type: String, 
    default: null, 
  },
  dateCreated: {
    type: Date,
    default: Date.now, 
  },
  passType: {
    type: String,
    enum: ["VIP", "General", "Staff"], 
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "revoked", "expired"],
    default: "active", 
  },
});

const Pass = mongoose.model("Pass", passSchema);

module.exports = Pass;
