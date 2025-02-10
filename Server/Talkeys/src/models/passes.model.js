const mongoose = require("mongoose");

const passSchema = new mongoose.Schema({
	// user and event details
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	eventId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Event",
		required: true,
	},
	Team: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "TeamSchema",
	},
	status: {
		type: String,
		enum: ["active", "revoked", "expired","pending"],
		default: "pending",
	},


	// pass details
	isScanned: {
		type: Boolean,
		default: false,
	},
	timeScanned: {
		type: String,
		default: null,
	},


	// backend information
	dateCreated: {
		type: Date,
		default: Date.now,
	},
	slotID: {
		type: Number,
		// required: true,
		enum: {
			values: [1, 2, 3, 4, 5],
			message: "Slot ID must be between 1 and 5",
		},
		default: 1,
	},
	passType: {
		type: String,
		enum: ["VIP", "General", "Staff"],
		// required: true,
		default: "General",
	},
});

const Pass = mongoose.model("Pass", passSchema);

module.exports = Pass;
