const mongoose = require("mongoose");

const passSchema = new mongoose.Schema({
  Team:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"TeamSchema"
  },
  isScanned: {
    type: Boolean,
    default: false, 
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  slotID:{
    type :int,
    required: true,
    enum: {
        values: [1, 2, 3, 4, 5],
        message: "Slot ID must be between 1 and 5",
    },
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
    default:'General'
  },
  status: {
    type: String,
    enum: ["active", "revoked", "expired"],
    default: "active", 
  },
});

const Pass = mongoose.model("Pass", passSchema);

module.exports = Pass;
