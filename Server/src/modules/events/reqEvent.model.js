const mongoose = require("mongoose");	

const reqEventSchema = new mongoose.Schema({
	Name : {
		type: String,
		required: true,
	},
	Email : {
		type: String,
		required: true,
	},

	Phone : {
		type: String,
		required: true,
	},
	isSlotted : {
		type: Number,
		required: true,
	},
	isTeamEvent: {
		type: Boolean,
		required: true,
		default: false,
	},
	isPaid: {
		type: Boolean,
		required: true,
		default: false,
	},
	date: {
		type: Date,
		required: true,
	},

});

const reqEvent = mongoose.model("reqEvent", reqEventSchema);
module.exports = reqEvent;