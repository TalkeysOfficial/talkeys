const { bool, boolean } = require("joi");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const infs = new mongoose.Schema({
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
	passStatus: {	
		type: String,
		enum: ["active", "inactive", "expired", "revoked"],
		default: "active",
	}
})


const inf = mongoose.model("inf", infs);

module.exports = inf;