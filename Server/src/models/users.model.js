const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // basic identity
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    required: true,
    unique: true,
  },

  // optional fields
  displayName: {
    type: String,
    default: "", 
  },
  about: {
    type: String,
    default: "", 
  },

  likedEvents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Event",
    default: [],
  },

  //backend
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["user", "admin","organizer"],
    default: "user",
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
