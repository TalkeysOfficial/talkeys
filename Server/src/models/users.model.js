const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	//user details
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
	

	// extra details
	likedEvents: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: "Event",
		default: [],
	},


	// backend information
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
		enum: ["user", "admin"],
		default: "user",
	},
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
